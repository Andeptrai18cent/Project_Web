const connection = require('../config/database')
const express = require('express')
const app = express()

const getHomePage = (req, res) => {
    //console.log(res.header('auth-token'))
    res.render('HomePage.ejs')
}

const getAboutPage = (req, res) => {
    res.render('about.ejs')
}

const getServicePage = (req, res) => {
    res.render('servicepage.ejs')
}

const getLoginPage = (req, res) => {
    res.render('login.ejs')
}

const getSignUpPage = (req, res) => {
    res.render('signup.ejs')
}
module.exports = {
    getHomePage,
    getAboutPage,
    getServicePage,
    getLoginPage,
    getSignUpPage
}