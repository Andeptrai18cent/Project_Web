const connection = require('../config/database')
const express = require('express')
const app = express()

const getAdminPage = (req, res) => {
    res.render('Admin.ejs')
}

module.exports = {
    getAdminPage
}