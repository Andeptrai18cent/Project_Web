const connection = require('../config/database')
const express = require('express')
const app = express()

const getStep1OrderTask = (req, res) => {
    res.render('step1.ejs')
}

const getStep2OrderTask = async (req, res) => {
    console.log('Step 1 info', req.body)
    res.render('step2.ejs')
}
const getStep3OrderTask = (req, res) => {
    res.render('step3.ejs')
}
module.exports = {
    getStep1OrderTask,
    getStep2OrderTask,
    getStep3OrderTask
}