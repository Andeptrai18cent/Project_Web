const express = require('express')
const service = express.Router()

const {
    showServiceInfo,
    getService
} = require('../controllers/serviceController')

service.get('/service/:id', showServiceInfo) //res.params
service.get('/service-info/:service_id', getService)

module.exports = service