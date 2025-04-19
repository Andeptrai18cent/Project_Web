const connection = require('../config/database')
const express = require('express')
const app = express()

const {getAllService,getAllServiceGroup,getServiceGroupAndService} = require('../services/service')

const showServiceByServiceGroup = async (req, res) => {
    let result = await getServiceGroupAndService()
    res.render('servicepage.ejs', {services: result})
}

const showServiceInfo = async (req, res) => {
    console.log(req.params)
    res.render('service_info.ejs', {service_id: req.params.id})
}
module.exports = {
    showServiceByServiceGroup,
    showServiceInfo
}