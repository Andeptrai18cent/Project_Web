const express = require('express')
const report = express.Router()
const{
    createReportTasker,
    createReportUser
} = require('../controllers/reportController')

report.post('/report/tasker/new', createReportTasker)
report.post('/report/user/new', createReportUser)

module.exports = report