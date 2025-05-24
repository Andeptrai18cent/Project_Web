const express = require('express')
const payment = express.Router()

const {
    createPayment,
    showPaymentForm
} = require('../controllers/paymentController')

const {
    verifyTokenUser_Task
} = require('../middlerware/verifyToken')
payment.post('/create-payment/', verifyTokenUser_Task, createPayment)
payment.get('/payment/create', showPaymentForm)

module.exports = payment