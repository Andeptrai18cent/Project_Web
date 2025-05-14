const express = require('express')
const tasker = express.Router()

const {
    postNewTasker,
    getTasksByTaskerId,
    getTaskbyTaskerId,
    updateTaskerInfo,
    receiveTask,
    getTaskByTaskerIdAndStatus,
    getPendingTaskbyTaskerId
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
tasker.get('/tasker/tasks', getTaskByTaskerIdAndStatus)
tasker.get('/tasker/pending-tasks', getPendingTaskbyTaskerId)

module.exports = tasker