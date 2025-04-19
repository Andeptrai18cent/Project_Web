const express = require('express')
const orderTask = express.Router()

const {getStep1OrderTask ,getStep2OrderTask ,getStep3OrderTask} = require('../controllers/orderTaskController')

orderTask.get('/order-task/step1/:id', getStep1OrderTask)
orderTask.post('/order-task/step2', getStep2OrderTask)
orderTask.get('/order-task/step3', getStep3OrderTask)

module.exports = orderTask