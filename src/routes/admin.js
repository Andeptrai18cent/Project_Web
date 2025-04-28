const express = require('express')
const admin = express.Router()

const {getAdminPage, getGetTaskPage} = require('../controllers/adminController')

admin.get('/admin', getAdminPage)
admin.get('/test-get-task', getGetTaskPage)
module.exports = admin