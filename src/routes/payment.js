const express = require('express')
const payment = express.Router()

const {
    createPayment
} = require('../controllers/paymentController')

payment.post('/create-payment/', createPayment)


module.exports = payment