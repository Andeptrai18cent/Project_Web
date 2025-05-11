const connection = require('../config/database')
const {getAllServiceGroup} = require('../services/service')
const jwt = require('jsonwebtoken');
const {get_Tasks_By_TaskerId} = require('../services/task')
const {
    create_New_Tasker,
    get_Tasker_By_Tasker_ID,
    update_Tasker_Info
} = require('../services/tasker')
const getBecomeTaskerForm = async (req, res) => {
    let result = await getAllServiceGroup()
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    res.render('DkyTasker.ejs', {service_groups: result, user_id: user_id})
}

const postNewTasker = async(req, res) => {
    return await create_New_Tasker(req, res)
}

const getTasksByTaskerId = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    console.log("Tasker id: ", tasker_id)
    return res.send(await get_Tasks_By_TaskerId(tasker_id))
}

const getTaskerbyTaskerId = async(req, res) => {
    return await get_Tasker_By_Tasker_ID(req, res)
}

const updateTaskerInfo = async(req, res) => {
    return await update_Tasker_Info(req, res)
}
module.exports = {
    getBecomeTaskerForm,
    postNewTasker,
    getTasksByTaskerId,
    getTaskerbyTaskerId,
    updateTaskerInfo
}