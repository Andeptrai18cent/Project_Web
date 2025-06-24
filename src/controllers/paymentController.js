const {
    create_Payment,
    getPayment_by_taskID
} = require('../services/payment')
const createPayment = async (req, res) => {
    return res.send(JSON.stringify(await create_Payment(req, res)))
}

const showPaymentForm = async(req, res) => {
    res.render('paymentForm.ejs')
}

const getPaymentByTaskID = async(req, res) => {
    return res.send(JSON.stringify(await getPayment_by_taskID(req.query.task_id)))
}
module.exports = {
    createPayment,
    showPaymentForm,
    getPaymentByTaskID
}