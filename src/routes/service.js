const express = require('express')
const service = express.Router()
const {showServiceInfo,
    searchServicesController,
    suggestServices,getService,
    showServiceByServiceGroup,
    getServiceGroupAPI
} = require('../controllers/serviceController')

service.get('/search', searchServicesController) // search
service.get('/suggest', suggestServices); //suggest
service.get('/service/:id', showServiceInfo) //res.params
service.get('/service-info/:service_id',getService)
service.get('/service-link', showServiceByServiceGroup) 
service.get('/get_all_service_group', getServiceGroupAPI)

module.exports = service