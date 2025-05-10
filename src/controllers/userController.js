const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { registerValidator } = require('../validation/auth');
const connection = require('../config/database')
require("dotenv").config()
const cookieParser = require('cookie-parser'); //Thiết lập gói cookie-parser
const crypto = require('crypto');
const {get_Tasks_By_UserId} = require('../services/task');
const { log } = require('console');

const authenUser = async (req, res) => {
    const validate_error = await registerValidator(req.body);

    //console.log(validate_error)
    if (validate_error.error) return res.status(422).send(validate_error.error.details[0].message);

    const checkEmailExist = await connection.from('Users').select('email').eq('email', req.body.email)

    //console.log(checkEmailExist)

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
        const {data} = await connection.from('Taskers').select('tasker_id').eq('user_id', user_info.user_id)
        var tasker_id = undefined
        if (Array.isArray(data) && data.length)
            tasker_id = data[0].tasker_id
        token = jwt.sign({user_id: user_info.user_id, tasker_id: tasker_id}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie('token', token)
        res.send({
            token: token,
            user_id: user_info.user_id,
            tasker_id: tasker_id
        })
        //res.redirect('/')
    }
    else return res.status(422).send('Tên đăng nhập hoặc mật khẩu sai')
}

const getTasksByUserId = async(req, res) => {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await get_Tasks_By_UserId(user_id))
}

const showUserInfo = async(req, res) => {
    res.render('showUserInfo.ejs')
}

const showChangeUserInfoForm = async(req, res) => {
    res.render('changeUserInfoForm.ejs')
}

const logOut = async(req, res) => {
    // console.log("Cookies before",req.cookies.token)
    // console.log("Session before:", req.session.step1Data)
    await req.session.destroy(err => {
        res.clearCookie('token')
        // console.log("Cookies logout ", req.cookies.token)
        // console.log("Session logout:", req.session)
        return res.send({status: "OK", message: "Đăng xuất thành công"})
    })
}

const showchangePasswordForm = async(req, res) => {
    res.render('changeUserPassword.ejs')
}

const changeUserPassword = async(req, res) => {
    try
    {
        const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        const { new_password, repeat_new_password } = req.body;
        if (!new_password || !repeat_new_password) {
            return res.status(400).json({ error: 'Điền thiếu thông tin' });
        }

        if (new_password !== repeat_new_password) {
            return res.status(400).json({ error: 'Hai mật khẩu không trùng nhau' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(new_password, salt);
        const { data, error } = await connection
        .from('Users')
        .update({ password: hashPassword })
        .eq('id', user_id)
        .select();
        if (error) {
            return res.status(500).json({ error: 'Thay đổi mật khẩu thất bại', details: error.message });
        }
        res.status(200).json({ message: 'Cập nhật mật khẩu thành công', user: data });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server', details: err.message });
    }
}

const showTaskForUser = async(req, res) => {
    res.render('showTaskForCustomer.ejs')
}
module.exports = {
    authenUser,
    loginUser,
    getTasksByUserId,
    showUserInfo,
    showChangeUserInfoForm,
    logOut,
    showchangePasswordForm,
    changeUserPassword,
    showTaskForUser
};
