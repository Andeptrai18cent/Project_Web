const connection = require('../config/database')
const Revenue = require('../models/revenue')
const {
    getPayment_by_taskID
} = require('../services/payment')
const {
    get_Task_by_TaskId
} = require('../services/task')
const {
    get_tasker_for_revenue
} = require('../services/tasker')
const create_Revenue = async (req, res, task_id) => {
    try {
        var payment = await getPayment_by_taskID(task_id)
        const task = await get_Task_by_TaskId(task_id)
        payment = payment.data
        var tasker = await get_tasker_for_revenue(task.tasker_id)
        tasker = tasker.data
        var taskerEarning = payment.total_price
        const companyRevenue = taskerEarning * 0.05; // 5% phí cho công ty
        const revenue = new Revenue(
            payment.payment_id,
            task_id,
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
        const currentIncome = tasker.actual_income || 0;
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