const express = require('express')
const orderTask = express.Router()

const {
    getStep1OrderTask,
    getStep3OrderTask,
    postNewTask,
    putTaskStatus,
    finishStep1OrderTask,
    getTaskerByServiceGroupId,
    sortTaskerByTaskDone,
    sortTaskerByRating,
    sortTaskerByWage,
    startWork,
    endWork,
    getStep2OrderTask
} = require('../controllers/orderTaskController')

const {
    verifyTokenUser,
    verifyTokenTasker,
    verifyTokenUser_Task,
    verifyTokenTasker_Task
} = require('../middlerware/verifyToken')
orderTask.get('/order-task/step1/:service_id', getStep1OrderTask)
orderTask.post('/order-task/step1_finish/:service_id', finishStep1OrderTask)
orderTask.get('/order-task/step3', getStep3OrderTask)
orderTask.post('/post-new-task', postNewTask)
orderTask.put('/user/update-task-status', verifyTokenUser_Task, putTaskStatus)
orderTask.get('/get_tasker-by-service-group', getTaskerByServiceGroupId)
orderTask.get('/sort-tasker-by-task-done', sortTaskerByTaskDone)
orderTask.get('/sort-tasker-by-rating', sortTaskerByRating)
orderTask.get('/sort-tasker-by-wage', sortTaskerByWage)
orderTask.post('/task/start-task', verifyTokenTasker_Task, startWork)
orderTask.post('/task/end-work', verifyTokenTasker_Task, endWork)
orderTask.get('/order-task/step2', getStep2OrderTask)
module.exports = orderTask