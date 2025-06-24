const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const Payment = require('../models/payment')
const {create_Revenue} = require('./revenue')

const create_Payment = async (req, res) => {
    try {
        const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        const task_id = req.query.task_id
        var tasker = await connection.from("Taskers").select().eq("tasker_id", tasker_id)
        var task = await connection.from("Tasks").select().eq("task_id", task_id).single()
        task = task.data
        console.log(task_id)
        console.log(task)
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

        const user_id = task.user_id
        // Lấy user_id của tasker từ bảng Taskers
        const payee_user_id = tasker.data[0].user_id
        
        const payment = new Payment(
            task_id, 
            user_id,        // payer_user_id
            payee_user_id,  // payee_user_id (không phải tasker_id)
            null,
            taskerEarning
        );
        
        const { data, error } = await connection.from('Payment').insert(payment).select().single()
        if (error) {
            console.error("Error creating new payment", error)
            return { success: false, error }
        }
        return await create_Revenue(data, task, tasker)
    } catch (err) {
        console.error("Exception in createPayment:", err)
        return { success: false, error: err.message }
    }
}

const update_payment_date_by_taskID = async(task_id) => {
    console.log("Update Date Payment: " + new Date().toISOString())
    console.log(task_id)
    const {error} = await connection.from("Payment").update(
        {
            payment_date: new Date().toISOString()
        }
    ).eq("task_id", task_id)
    if (error)
        return {succes: false, error: error}
    else
        return {succes: true}
}

const getPayment_by_taskID = async(task_id) => {
    const {data, error} = await connection.from("Payment").select().eq("task_id", task_id).single()
    if (error)
        return {success: false, error: error}
    else
        return {success: true, data: data}
}
module.exports = {
    create_Payment,
    update_payment_date_by_taskID,
    getPayment_by_taskID
}