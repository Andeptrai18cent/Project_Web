const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { registerValidator } = require('../validation/auth');
const connection = require('../config/database')
require("dotenv").config()
const {
  get_Tasks_By_UserId,
  get_Tasks_By_UserID_And_Status,
  update_Task_Status,
  change_task_info
} = require('../services/task');
const {
  get_user_info,
  get_user_info_NoToken
} = require('../services/user')
const {
  create_Review,
  get_Review_by_TaskId
} = require('../services/review')
const { AuthSessionMissingError } = require('@supabase/supabase-js');

const authenUser = async (req, res) => {
    const validate_error = await registerValidator(req.body);

    //console.log(validate_error)
    if (validate_error.error) 
      return res.status(422).send({
                status: 422,
                message: validate_error.error.details[0].message
            });
    const checkEmailExist = await connection
            .from('Users')
            .select('email')
            .eq('email', req.body.email);

    if (checkEmailExist.data.length) {
            return res.status(422).send({
                status: 422,
                message: 'Email already exists'
            });
    }
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
        return res.status(200).send({
            status: 200,
            message: "Success",
            data: data
        })          
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: "Internal server error"
        });
    }
}

const loginUser = async(req, res) => {
    const checkUsername = await connection.from('Users').select().eq('username', req.body.username)
    // if (!user) return response.status(422).send('Email or Password is not correct');
    if (Array.isArray(checkUsername.data) && checkUsername.data.length) {
        const user_info = checkUsername.data[0]
        const checkPassword = await bcrypt.compare(req.body.password, user_info.password);

        if (!checkPassword) return res.status(422).send(
          {
            status: 401,
            message:'Email or Password is not correct'}
        );
        const {data} = await connection.from('Taskers').select('tasker_id').eq('user_id', user_info.user_id)
        var tasker_id = undefined
        if (Array.isArray(data) && data.length)
            tasker_id = data[0].tasker_id
        token = jwt.sign({user_id: user_info.user_id, tasker_id: tasker_id}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie('token', token)
        res.send({
            status: 200,
            message:'Đăng nhập thành công'}
        )
        //res.redirect('/')
    }
    else return res.status(422).send({
            status: 401,
            message:'Email or Password is not correct'})
}

const getTasksByUserId = async(req, res) => {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await get_Tasks_By_UserId(user_id))
}

const showUserInfo = async(req, res) => {
    const {data} = await get_user_info(req)
    res.render('showUserInfo.ejs', {user_info: data})
}

const showChangeUserInfoForm = async(req, res) => {
    res.render('changeUserInfoForm.ejs')
}

const logOut = async(req, res) => {

    await req.session.destroy(err => {
        res.clearCookie('token')
        res.redirect('/')
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
        .eq('user_id', user_id)
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

const getUserInfo = async (req, res) => {
  try {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);

    const { data: user, error } = await connection
      .from('Users')
      .select('user_id, email, name, phone_number, address')
      .eq('user_id', user_id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found', error });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);

    const { email, name, phone_number, address } = req.body;

    // Build update object dynamically
    const updateData = {
      ...(email !== undefined && { email }),
      ...(name !== undefined && { name }),
      ...(phone_number !== undefined && { phone_number }),
      ...(address !== undefined && { address }),
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const { error } = await connection
      .from('Users')
      .update(updateData)
      .eq('user_id', user_id);

    if (error) {
      return res.status(500).json({ message: 'Failed to update user info', error });
    }

    return res.status(200).json({
      message: 'User info updated successfully',
      updated_fields: updateData
    });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

const getTasksByUserIDAndStatus = async(req, res) => {
  const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
  return res.send(await get_Tasks_By_UserID_And_Status(user_id, req.query.status))
}

const cancelPendingTask = async(req, res) => {
  return res.send(await update_Task_Status(req.query.task_id, "Canceled"))
}

const cancelConfirmedTask = async(req, res) => {
  return res.send(await update_Task_Status(req.query.task_id, "Cancel_Confirmation_waiting"))
}

const requestPaymentConfirm = async(req, res) => {  
  return res.send(await update_Task_Status(req.query.task_id, "Payment_Confirmation_waiting"))
}

const changeTaskInfo = async(req, res) => {
  return res.send(await change_task_info(req.query.task_id, req))
}

const reviewTask = async(req, res) => {
  return res.send(await create_Review(req))
}

const testGetSession = async(req, res) => {
  return res.send(req.session.step1Data)
}

const getUserNoToken = async(req, res) => {
  return res.send(await get_user_info_NoToken(req.params.id))
}

const checkReview = async(req, res) => {
  return res.send(await get_Review_by_TaskId(req.params.task_id))
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
    showTaskForUser,
    getUserInfo,
    updateUserInfo,
    getTasksByUserIDAndStatus,
    cancelPendingTask,
    cancelConfirmedTask,
    requestPaymentConfirm,
    changeTaskInfo,
    reviewTask,
    testGetSession,
    getUserNoToken,
    checkReview
};
