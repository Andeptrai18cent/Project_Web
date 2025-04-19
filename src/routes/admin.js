const express = require('express')
const admin = express.Router()

const {getAdminPage} = require('../controllers/adminController')

admin.get('/admin', getAdminPage)

module.exports = admin