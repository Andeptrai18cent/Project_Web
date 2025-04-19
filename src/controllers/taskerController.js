const connection = require('../config/database')
const express = require('express')
const app = express()
const {getAllServiceGroup} = require('../services/service')
const getBecomeTaskerForm = async (req, res) => {
    let result = await getAllServiceGroup()
    res.render('Dky.ejs', {service_groups: result})
}

module.exports = {
    getBecomeTaskerForm
}