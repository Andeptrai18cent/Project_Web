const express = require('express')
const user = express.Router()

const {
    showUserInfo,
    getTasksByUserId,
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
    testGetSession
} = require('../controllers/userController')

const {
    verifyTokenUser,
    verifyTokenUser_Task
} = require('../middlerware/verifyToken')
//user.get('/user/task-list', getTasksByUserId)
user.get('/user/info', verifyTokenUser, showUserInfo)
user.get('/get-user-info', verifyTokenUser, getUserInfo)
user.get('/user/change-info', verifyTokenUser, showChangeUserInfoForm)
user.post('/user-info-change', verifyTokenUser, updateUserInfo)
user.get('/logout', logOut)
user.put('/change-user-password', verifyTokenUser, changeUserPassword)
user.get('/user/change-password', verifyTokenUser, showchangePasswordForm)
user.get('/user/tasks', verifyTokenUser, getTasksByUserIDAndStatus)
user.post('/user/cancel-pending-task', verifyTokenUser_Task, cancelPendingTask)
user.post('/user/payment-confirmation-request', verifyTokenUser_Task, requestPaymentConfirm)
user.post('/user/cancel-confirmed-task', verifyTokenUser_Task, cancelConfirmedTask)
user.put('/user/change-task-info', verifyTokenUser_Task, changeTaskInfo)
user.get('/user/task-list', showTaskForUser)
user.post('/user/task/review', verifyTokenUser_Task, reviewTask)
user.get('/test-get-session', testGetSession)

module.exports = user