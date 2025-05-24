const express = require('express')
const service = express.Router()
const {showServiceInfo,searchServicesController,suggestServices} = require('../controllers/serviceController')

service.get('/search', searchServicesController) // search
service.get('/suggest', suggestServices); //suggest
service.get('/service/:id', showServiceInfo) //res.params

module.exports = service