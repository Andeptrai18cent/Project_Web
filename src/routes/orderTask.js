const express = require('express')
const orderTask = express.Router()

const {
    getStep1OrderTask,
    getStep2OrderTask,
    getStep3OrderTask,
    postNewTask,
    putTaskStatus,
    finishStep1OrderTask,
    getTaskerByServiceGroupId,
    sortTaskerByTaskDone,
    sortTaskerByRating,
    showPaymentForm
} = require('../controllers/orderTaskController')

orderTask.get('/order-task/step1/:service_id', getStep1OrderTask)
orderTask.post('/order-task/step1_finish/:service_id', finishStep1OrderTask)
orderTask.post('/order-task/step2', getStep2OrderTask)
orderTask.get('/order-task/step3', getStep3OrderTask)
orderTask.post('/post-new-task', postNewTask)
orderTask.put('/update-task-status', putTaskStatus)
orderTask.get('/get_tasker-by-service-group', getTaskerByServiceGroupId)
orderTask.get('/sort-tasker-by-task-done', sortTaskerByTaskDone)
orderTask.get('/sort-tasker-by-rating', sortTaskerByRating)
orderTask.get('/task/payment', showPaymentForm)

module.exports = orderTask