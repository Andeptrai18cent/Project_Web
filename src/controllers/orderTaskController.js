const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const {
    getServiceGroupFromService
} = require("../services/service")
const {
    create_Task, 
    update_Task_Status,
    get_Tasks_By_UserId,
    get_Tasks_By_TaskerId,
    get_All_Tasks,
} = require('../services/task')
const {
    get_Tasker_by_Service_group_id,
    get_Taskers_By_TaskCount,
    get_Taskers_With_Ratings
} = require("../services/tasker")

const getStep1OrderTask = (req, res) => {
    res.render('step1.ejs')
}

const getStep2OrderTask = async (req, res) => {
    console.log('Step 1 info', req.body)
    res.render('step2.ejs')
}
const getStep3OrderTask = async (req, res) => {
    res.render('step3.ejs')
}

const finishStep1OrderTask = async (req, res) => {
    const { address, workload, task_description } = req.body;
    const service_id = req.params.service_id
    req.session.step1Data = {
      address,
      workload,
      task_description,
      service_id
    };
    await req.session.save();
    return res.send(JSON.stringify(req.session.step1Data))
}
const postNewTask = async (req, res) => {
    return res.send(JSON.stringify(await create_Task(req ,req.body)))
}

const putTaskStatus = async (req, res) => {
    return res.send(JSON.stringify(await update_Task_Status(req.query.task_id, req.query.status)))
}

const getTasksByTaskerId = async (req, res) => {
    const user_id_jwt = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(JSON.stringify(await get_Tasks_By_TaskerId(user_id_jwt.tasker_id)))
}

const getTasksByUserId = async (req, res) => {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(JSON.stringify(await get_Tasks_By_UserId(user_id)))
}

const getTaskerByServiceGroupId = async (req, res) => {
    const service_group_id = await getServiceGroupFromService(req.session.step1Data.service_id)
    return res.send(await get_Tasker_by_Service_group_id(service_group_id))
}

const sortTaskerByTaskDone = async (req, res) => {
    return res.send(await get_Taskers_By_TaskCount())
}

const sortTaskerByRating = async (req, res) => {
    return res.send(await get_Taskers_With_Ratings())
}

const showPaymentForm = async (req, res) => {
    return res.render("paymentForm.ejs")
}
module.exports = {
    getStep1OrderTask,
    getStep2OrderTask,
    getStep3OrderTask,
    postNewTask,
    putTaskStatus,
    getTasksByTaskerId,
    getTasksByUserId,
    finishStep1OrderTask,
    getTaskerByServiceGroupId,
    sortTaskerByTaskDone,
    sortTaskerByRating,
    showPaymentForm
}