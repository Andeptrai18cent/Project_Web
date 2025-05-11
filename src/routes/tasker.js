const express = require('express')
const tasker = express.Router()

const {
    postNewTasker,
    getTasksByTaskerId,
    getTaskerbyTaskerId,
    updateTaskerInfo,
} = require('../controllers/taskerController')

tasker.post('/addNewTasker/:user_id', postNewTasker)
tasker.get('/task-list-for-tasker', getTasksByTaskerId)
tasker.get('/get-tasker-info', getTaskerbyTaskerId)
tasker.post('/update-task-info', updateTaskerInfo)

module.exports = tasker