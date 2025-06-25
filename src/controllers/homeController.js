const connection = require('../config/database')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const user = require('../routes/user')
const getHomePage = (req, res) => {
    let user_id = '';
    try{
        const token = req.cookies.token;
        if (token) {
            user_id = jwt.verify(token, process.env.TOKEN_SECRET).user_id;
        }
    }
    catch (err) {
       user_id = '';
    }
    res.render('HomePage.ejs', {userId: user_id});
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