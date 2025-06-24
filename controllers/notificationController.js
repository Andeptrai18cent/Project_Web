// controllers/notificationController.js
const NotificationModel = require('../models/notification')
const jwt = require('jsonwebtoken')

const NotificationController = {
  // API lấy notifications
  async getNotifications(req, res) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    const userId = decoded.user_id
    const userType = decoded.tasker_id ? 'tasker' : 'user'
    console.log('User ID:', userId, 'User Type:', userType)
    const notifications = await NotificationModel.getNotificationHistory(userId, userType)
    console.log('Notifications:', notifications)  
    res.render('notifications.ejs', {
        title: 'Thông báo',
        notifications,
        userType
    })

    } catch (error) {
      console.error('Error getting notifications:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // API đếm notification chưa đọc
  async getUnreadCount(req, res) {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ count: 0 })
      }

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      const userId = decoded.user_id
      const userType = decoded.tasker_id ? 'tasker' : 'user'
      
      // Lấy lastReadTime từ localStorage (gửi từ client)
      const lastReadTime = req.query.lastReadTime || new Date(Date.now() - 24*60*60*1000)
      
      const count = await NotificationModel.getUnreadCount(userId, userType, lastReadTime)
      
      res.json({ count })
    } catch (error) {
      console.error('Error getting unread count:', error)
      res.json({ count: 0 })
    }
  },

  // Helper function để gửi realtime notification
  sendRealtimeNotification(io, userId, notification) {
    io.to(`user-${userId}`).emit('new-notification', {
      ...notification,
      timestamp: new Date()
    })
  },
}

module.exports = NotificationController