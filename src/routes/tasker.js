const express = require('express')
const tasker = express.Router()

const {
    postNewTasker,
    getTasksByTaskerId,
    getTaskbyTaskerId,
    updateTaskerInfo,
    receiveTask,
    getTaskByTaskerIdAndStatus,
    getPendingTaskbyTaskerId,
    confirmTaskPayment,
    confirmTaskCanceling,
    getReviewByTask
} = require('../controllers/taskerController')
const {
    verifyTokenTasker_Task,
    verifyTokenTasker,
    verifyTokenUser
} = require('../middlerware/verifyToken')

tasker.post('/addNewTasker', verifyTokenUser, postNewTasker)
tasker.get('/task-list-for-tasker', verifyTokenTasker, getTasksByTaskerId)
tasker.get('/get-tasker-info', verifyTokenTasker, getTaskbyTaskerId)
tasker.post('/update-task-info', verifyTokenTasker, updateTaskerInfo)
tasker.post('/tasker-confirm-tasks', verifyTokenTasker_Task, receiveTask)
tasker.get('/tasker/tasks', verifyTokenTasker, getTaskByTaskerIdAndStatus)
tasker.get('/tasker/pending-tasks', verifyTokenTasker, getPendingTaskbyTaskerId)
tasker.post('/tasker/task-payment-confirm', verifyTokenTasker_Task, confirmTaskPayment)
tasker.post('/tasker/task-cancel-confirm', verifyTokenTasker_Task, confirmTaskCanceling)
tasker.get('/tasker/task/review', verifyTokenTasker_Task, getReviewByTask)

module.exports = tasker