const express = require('express')
const user = express.Router()

const {
    getTasksByUserId,
    showUserInfo,
    showChangeUserInfoForm,
    logOut,
    showchangePasswordForm,
    changeUserPassword,
    showTaskForUser
} = require('../controllers/userController')

user.get('/user/task-list', showTaskForUser)
user.get('/task-list-for-user', getTasksByUserId)
user.get('/user/info', showUserInfo)
user.get('/user/change-info', showChangeUserInfoForm)
user.get('/logout', logOut)
user.put('/change-user-password-api', changeUserPassword)
user.get('/change-user-password', showchangePasswordForm)

module.exports = user