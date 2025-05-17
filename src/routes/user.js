const express = require('express')
const user = express.Router()

const {
    showUserInfo,
    showChangeUserInfoForm,
    logOut,
    showchangePasswordForm,
    changeUserPassword,
    showTaskForUser,
    getUserInfo,
    updateUserInfo,
    getTasksByUserIDAndStatus,
    cancelPendingTask
} = require('../controllers/userController')

const {
    verifyTokenUser,
    verifyTokenUser_Task
} = require('../middlerware/verifyToken')
user.get('/user/task-list', showTaskForUser)
user.get('/user/info', showUserInfo)
user.get('/get-user-info', verifyTokenUser, getUserInfo)
user.get('/user/change-info', showChangeUserInfoForm)
user.post('/user-info-change', verifyTokenUser, updateUserInfo)
user.get('/logout', logOut)
user.put('/change-user-password', verifyTokenUser, changeUserPassword)
user.get('/user/change-password', showchangePasswordForm)
user.get('user/tasks', verifyTokenUser, getTasksByUserIDAndStatus)
user.post('/user/cancel-pending-task', verifyTokenUser_Task, cancelPendingTask)
module.exports = user