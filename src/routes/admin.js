const express = require('express')
const admin = express.Router()
const {displayUser, getGetTaskPage, getUserPage} = require('../controllers/adminController')

admin.get('/admin', displayUser)
admin.get('/test-get-task', getGetTaskPage)
module.exports = admin