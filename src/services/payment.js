const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const Payment = require('../models/payment')
const {create_Revenue} = require('./revenue')
const create_Payment = async (req, res) => {
    try {
        const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        const task_id = req.query.task_id
        const task = await connection.from("Tasks").select().eq("task_id", task_id)
        const tasker_id = task.data[0].tasker_id
        const payment = new Payment(
            req.query.task_id, 
            user_id,
            tasker_id,
            new Date().toISOString()
        );
        const { data, error } = await connection.from('Payment').insert(payment).select()
        if (error) {
            console.error("Error creating new payment", error)
            return { success: false, error }
        }

        return await create_Revenue(req, data[0], task.data[0])
    } catch (err) {
        console.error("Exception in createPayment:", err)
        return { success: false, error: err.message }
    }
}

module.exports = {
    create_Payment
}