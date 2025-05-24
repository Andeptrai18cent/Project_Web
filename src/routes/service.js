const express = require('express')
const service = express.Router()
const {showServiceInfo,searchServicesController,suggestServices,getService,showServiceByServiceGroup} = require('../controllers/serviceController')

service.get('/search', searchServicesController) // search
service.get('/suggest', suggestServices); //suggest
service.get('/service/:id', showServiceInfo) //res.params
service.get('/service-info/:service_id',getService)
service.get('/service-link', showServiceByServiceGroup) 
module.exports = service