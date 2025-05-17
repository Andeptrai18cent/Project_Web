const connection = require('../config/database')
const Revenue = require('../models/revenue')
const create_Revenue = async (req, payment, task) => {
    try {
        var tasker = await connection.from("Taskers").select().eq("tasker_id", task.tasker_id)
        const start_work = new Date(task.work_start_at)
        const end_work = new Date(task.work_end_at)
        const diffInMs = Math.abs(start_work - end_work);
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        var taskerEarning = tasker.data[0].hourly_rate * diffInHours
        //return {minute: req.body.minute, hour: req.body.hour, taskerEarning: taskerEarning, actual_income: tasker.data[0].actual_income}
        const revenue = new Revenue(
            payment.payment_id,
            task.task_id,
            task.tasker_id,
            taskerEarning,
            taskerEarning * 0.05
        );

        const { data, error } = await connection.from('Revenue').insert(revenue).select()
        const update_income_tasker = await connection.from('Taskers').update({actual_income: tasker.data[0].actual_income + taskerEarning}).eq('tasker_id', task.tasker_id)
        if (error || update_income_tasker.error) {
            console.error("Error creating new Revenue", error)
            return { success: false, error }
        }

        return { success: true, data: data[0] }
    } catch (err) {
        console.error("Exception in createRevenue:", err)
        return { success: false, error: err.message }
    }
}

module.exports = {
    create_Revenue
}