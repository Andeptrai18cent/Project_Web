const supabase = require('../config/database')

const NotificationModel = {
  async getNotificationHistory(userId, userType) {
    try {
      let data, error 
      if (userType === 'user') {
        ({ data, error } = await supabase
          .from('Tasks')
          .select(`
            task_id,
            status,
            created_at,
            work_start_at,
            work_end_at,
            Services ( name ),
            Taskers (
              tasker_id, 
              Users ( name )
            )
          `)
          .eq('user_id', userId)
          .or('status.in.(2,3,4,5),work_end_at.not.is.null')
          .order('created_at', { ascending: false })
          .limit(20)
        )
        console.log('User notifications:', data)
      } else {
        ({ data, error } = await supabase
          .from('Tasks')
          .select(`
            task_id,
            status,
            created_at,
            work_start_at,
            work_end_at,
            Services ( name ),
            Users ( name, user_id ),
            Taskers ( user_id )
          `)
          .eq('Taskers.user_id', userId)
          .neq('status', '0')
          .order('created_at', { ascending: false })
          .limit(20)
        )
      }

      if (error) throw error

      return data
        .map(t => {
          let notification_type = null

          if (userType === 'user') {
            if (t.status === '2' && t.work_end_at) notification_type = 'completed'
            else if (t.status === '3') notification_type = 'cancelled'
            else if (t.status === '4') notification_type = 'payment_pending'
            else if (t.status === '5') notification_type = 'paid'
            else if (t.status === '2' && t.work_start_at) notification_type = 'in_progress'
            else if (t.status === '1' && new Date(t.created_at) > Date.now() - 86400000)
              notification_type = 'new_task'
          } else {
            if (t.status === '1' && new Date(t.created_at) > Date.now() - 86400000)
              notification_type = 'new_order'
            else if (t.status === '3') notification_type = 'cancelled'
            else if (t.status === '4') notification_type = 'awaiting_confirmation'
            else if (t.status === '5') notification_type = 'payment_confirmed'
          }

          const messages = {
            new_task: 'Đơn hàng của bạn đã được giao cho tasker',
            new_order: 'Bạn có đơn hàng mới',
            in_progress: 'Tasker đã bắt đầu làm việc',
            completed: 'Công việc đã hoàn thành! Vui lòng thanh toán',
            cancelled: 'Công việc đã bị hủy',
            payment_pending: 'Đang chờ tasker xác nhận thanh toán',
            awaiting_confirmation: 'Khách hàng đã thanh toán, vui lòng xác nhận',
            paid: 'Thanh toán đã hoàn tất',
            payment_confirmed: 'Thanh toán đã được xác nhận'
          }

          return {
            taskId: t.task_id,
            type: notification_type,
            message: messages[notification_type] || 'Cập nhật mới',
            serviceName: t.Services?.name || '',
            personName: t.Taskers?.Users?.name || t.Users?.name || '',
            time: t.work_end_at || t.work_start_at || t.created_at,
            status: t.status
          }
        })
        .filter(n => n.type !== null)
    } catch (err) {
      console.error('Lỗi lấy notification:', err)
      return []
    }
  },

  async getUnreadCount(userId, userType, lastReadTime) {
    try {
      let data, error

      if (userType === 'user') {
        ({ data, error } = await supabase
          .from('Tasks')
          .select('task_id', { count: 'exact' })
          .eq('user_id', userId)
          .or(`work_end_at.gt.${lastReadTime},status.eq.3`)
        )
      } else {
        ({ data, error } = await supabase
          .from('Tasks')
          .select('task_id', { count: 'exact' })
          .eq('tasker_id', userId)
          .gt('created_at', lastReadTime)
        )
      }

      if (error) throw error
      return data.length
    } catch (err) {
      console.error('Lỗi đếm thông báo chưa đọc:', err)
      return 0
    }
  }
}

module.exports = NotificationModel
