const express = require('express')
const home = express.Router()

const { getAboutPage,
        getHomePage,
        getServicePage,
        getLoginPage,
        getSignUpPage} 
= require('../controllers/homeController')
const {showServiceByServiceGroup} = require('../controllers/serviceController')
const {getBecomeTaskerForm} = require('../controllers/taskerController')

const {verifyTokenUser} = require('../middlerware/verifyToken')
home.get('/', getHomePage)
home.get('/about', getAboutPage)
home.get('/login', getLoginPage)
home.get('/signup', getSignUpPage)

home.get('/service', showServiceByServiceGroup)
home.get('/become-tasker', getBecomeTaskerForm)

module.exports = home