const connection = require('../config/database')
const express = require('express')
const app = express()
const {getAllServiceGroup} = require('../services/service')
const jwt = require('jsonwebtoken');

const getBecomeTaskerForm = async (req, res) => {
    let result = await getAllServiceGroup()
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    res.render('Dky.ejs', {service_groups: result, user_id: user_id})
}

const postNewTasker = async(req, res) => {
    const user_id = req.params.user_id
    const {error} = await connection.from("Taskers").insert({user_id: user_id, bio: "New tasker", hourly_rate: 50000, actual_income: 0})
    if (error)
    {
        console.log(error)
        return res.status(401).send("Không tạo được tasker mới")
    }
    console.log("Tạo tasker mới thành công")
    res.redirect('/')
}
module.exports = {
    getBecomeTaskerForm,
    postNewTasker
}