const express = require('express')
const service = express.Router()

const {showServiceInfo} = require('../controllers/serviceController')

service.get('/service/:id', showServiceInfo) //res.params

module.exports = service