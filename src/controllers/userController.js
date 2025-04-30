const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { registerValidator } = require('../validation/auth');
const connection = require('../config/database')
require("dotenv").config()
const cookieParser = require('cookie-parser'); //Thiết lập gói cookie-parser
const crypto = require('crypto');

const authenUser = async (req, res) => {
    const validate_error = await registerValidator(req.body);

    //console.log(validate_error)
    if (validate_error.error) return res.status(422).send(validate_error.error.details[0].message);

    const checkEmailExist = await connection.from('Users').select('email').eq('email', req.body.email)

    console.log(checkEmailExist)

    //if (checkEmailExist.data.length) return res.status(422).send('Email is exist');

    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User(
        email = req.body.email,
        name = req.body.name,   
        phone_number = req.body.phone_number,
        username =  req.body.username,
        password = hashPassword,
        address = req.body.address
    );

    try {
        //const newUser = await user.save();
        const {data, error} = await connection.from("Users").insert(user).select()
        await res.send(data);
    } catch (err) {
        await res.status(400).send(err);
    }
}

const loginUser = async(req, res) => {
    const checkUsername = await connection.from('Users').select().eq('username', req.body.username)
    // if (!user) return response.status(422).send('Email or Password is not correct');
    if (Array.isArray(checkUsername.data) && checkUsername.data.length) {
        const user_info = checkUsername.data[0]
        const checkPassword = await bcrypt.compare(req.body.password, user_info.password);

        if (!checkPassword) return res.status(422).send('Email or Password is not correct');

        const token = jwt.sign({user_id: user_info.user_id}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
        res.cookie('token', token)
        res.redirect('/')
    }
    else return res.status(422).send('Tên đăng nhập hoặc mật khẩu sai')
}
module.exports = {
    authenUser,
    loginUser
};
