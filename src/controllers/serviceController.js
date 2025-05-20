const connection = require('../config/database')
const express = require('express')
const app = express()

const {getAllService,getAllServiceGroup,getServiceGroupAndService} = require('../services/service')

const showServiceByServiceGroup = async (req, res) => {
    let result = await getServiceGroupAndService()
    console.log(result)
    res.render('servicepage.ejs', {services: result})
}

const showServiceInfo = async (req, res) => {
    res.render('service_info.ejs', {service_id: req.params.id})
}
module.exports = {
    showServiceByServiceGroup,
    showServiceInfo
}