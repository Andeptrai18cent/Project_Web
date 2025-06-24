const connection = require('../config/database')
const Revenue = require('../models/revenue')

const create_Revenue = async (req, payment, task) => {
    try {
        // Kiểm tra tasker có tồn tại không
        var tasker = await connection.from("Taskers").select().eq("tasker_id", task.tasker_id)
        if (!tasker.data || tasker.data.length === 0) {
            return { success: false, error: `Tasker with ID ${task.tasker_id} not found` }
        }

        // Kiểm tra thời gian work có hợp lệ không
        if (!task.work_start_at || !task.work_end_at) {
            return { success: false, error: 'Work start time and end time are required' }
        }

        const start_work = new Date(task.work_start_at)
        const end_work = new Date(task.work_end_at)

        // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
        if (end_work <= start_work) {
            return { success: false, error: 'Work end time must be after start time' }
        }

        // THÊM: Tính diffInMs trước khi sử dụng
        const diffInMs = end_work - start_work;
        const diffInMinutes = Math.round(diffInMs / (1000 * 60)); // Làm tròn theo phút
        const diffInHours = diffInMinutes / 60; // Chuyển về giờ thập phân
        
        // Kiểm tra hourly_rate có hợp lệ không
        const hourlyRate = tasker.data[0].hourly_rate || 0;
        if (hourlyRate <= 0) {
            return { success: false, error: 'Invalid hourly rate for tasker' }
        }

        var taskerEarning = hourlyRate * diffInHours;
        console.log('Hourly rate:', hourlyRate);
        console.log('Tasker earning:', taskerEarning);

        const companyRevenue = taskerEarning * 0.05; // 5% phí cho công ty
        console.log('Company revenue (5%):', companyRevenue);
        console.log('=== END DEBUG ===');

        const revenue = new Revenue(
            payment.payment_id,
            task.task_id,
            task.tasker_id,
            taskerEarning,
            companyRevenue  
        );

        // Insert revenue
        const { data, error } = await connection.from('Revenue').insert(revenue).select()
        if (error) {
            console.error("Error creating new Revenue", error)
            return { success: false, error }
        }

        // Update tasker income
        const currentIncome = tasker.data[0].actual_income || 0;
        const update_income_tasker = await connection
            .from('Taskers')
            .update({actual_income: currentIncome + taskerEarning})
            .eq('tasker_id', task.tasker_id)
            
        if (update_income_tasker.error) {
            console.error("Error updating tasker income", update_income_tasker.error)
            return { success: false, error: update_income_tasker.error }
        }

        return { 
            success: true, 
            data: data[0],
            taskerEarning,
            workHours: diffInHours,
            actualWorkMinutes: diffInMinutes, // Thêm để debug
            companyRevenue
        }
    } catch (err) {
        console.error("Exception in createRevenue:", err)
        return { success: false, error: err.message }
    }
}

module.exports = {
    create_Revenue
}