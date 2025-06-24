const express = require('express')
const payment = express.Router()

const {
    createPayment,
    showPaymentForm,
    getPaymentByTaskID
} = require('../controllers/paymentController')

const {
    verifyTokenTasker_Task
} = require('../middlerware/verifyToken')
payment.post('/create-payment/', verifyTokenTasker_Task, createPayment)
payment.get('/payment/create', showPaymentForm)
payment.get('/payment/get_by_task_id', getPaymentByTaskID)

module.exports = payment