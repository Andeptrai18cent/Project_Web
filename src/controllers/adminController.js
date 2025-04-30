const connection = require('../config/database')
const express = require('express')
const app = express()

const getAdminPage = (req, res) => {
    res.render('Admin.ejs')
}
const getGetTaskPage = (req, res) => {
    res.render('showTaskForCustomer.ejs')
}
module.exports = {
    getAdminPage,
    getGetTaskPage
}