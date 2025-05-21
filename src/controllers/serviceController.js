const connection = require('../config/database')
const express = require('express')
const app = express()

const {getServiceGroupAndService, getServiceByID} = require('../services/service')

const showServiceByServiceGroup = async (req, res) => {
    let result = await getServiceGroupAndService()
    res.render('servicepage.ejs', {services: result})
}

const showServiceInfo = async (req, res) => {
    res.render('service_info.ejs', {service_id: req.params.id})
}

const getService = async(req, res) => {
    res.send(await getServiceByID(req.params.service_id))
}
module.exports = {
    showServiceByServiceGroup,
    showServiceInfo,
    getService
}