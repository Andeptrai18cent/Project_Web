const connection = require('../config/database')
const express = require('express')
const app = express()

const {getAllService,getAllServiceGroup,getServiceGroupAndService} = require('../services/service')

const showServiceByServiceGroup = async (req, res) => {
    // const { data, error } = await connection.from('Admin').select('*');

    // if (error) {
    // console.error('Error fetching data:', error);
    // } else {
    // console.log('Fetched data:', data);
    // }
    // return res.json(data)
    let result = await getServiceGroupAndService()
    res.render('servicepage.ejs', {services: result})
}

const showServiceInfo = async (req, res) => {
    res.render('service_info.ejs', {service_id: req.params.id})
}
module.exports = {
    showServiceByServiceGroup,
    showServiceInfo
}