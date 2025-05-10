const express = require('express')
const tasker = express.Router()

const {
    getBecomeTaskerForm,
    postNewTasker,
    getTasksByTaskerId
} = require('../controllers/taskerController')

tasker.post('/addNewTasker/:user_id', postNewTasker)
tasker.get('/task-list-for-tasker', getTasksByTaskerId)

module.exports = tasker