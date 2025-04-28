const express = require('express')
const tasker = express.Router()

const {getBecomeTaskerForm, postNewTasker} = require('../controllers/taskerController')

tasker.post('/addNewTasker/:user_id', postNewTasker)
module.exports = tasker