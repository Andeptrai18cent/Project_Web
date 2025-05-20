const connection = require('../config/database')
const {getAllServiceGroup} = require('../services/service')
const jwt = require('jsonwebtoken');
const {
    get_Tasks_By_TaskerId,
    update_Task_Status,
    get_Tasks_By_TaskerID_And_Status
} = require('../services/task')
const {
    create_New_Tasker,
    get_Tasker_By_Tasker_ID,
    update_Tasker_Info
} = require('../services/tasker')
const {
    create_Payment
} = require('../services/payment')
const {
    get_Review_by_TaskId
} = require('../services/review')
const getBecomeTaskerForm = async (req, res) => {
    let result = await getAllServiceGroup()
    try
    {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    res.render('DkyTasker.ejs', {service_groups: result, user_id: user_id})
    }
    catch (err)
    {
        res.redirect('/login')
    }
}

const postNewTasker = async(req, res) => {
    return await create_New_Tasker(req, res)
}

const getTasksByTaskerId = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await get_Tasks_By_TaskerId(tasker_id))
}

const getTaskbyTaskerId = async(req, res) => {
    return await get_Tasker_By_Tasker_ID(req, res)
}

const updateTaskerInfo = async(req, res) => {
    return await update_Tasker_Info(req, res)
}

const receiveTask = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await update_Task_Status(tasker_id, "Confirmed"))
}

const getTaskByTaskerIdAndStatus = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await get_Tasks_By_TaskerID_And_Status(tasker_id, req.query.status))
}

const getPendingTaskbyTaskerId = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    return res.send(await get_Tasks_By_TaskerID_And_Status(tasker_id, "Pending"))
}

const confirmTaskCanceling = async(req, res) => {
    if (req.query.ans == "YES")
    {
        const update_task_status = await update_Task_Status(req.query.task_id, "Canceled")
        if (!update_task_status.success)
        {
            return res.send(update_task_status.error)
        }
        return res.send({
            message: "Đã đồng ý hủy task",
            data: update_task_status
        })
    }
    else
    {
        const update_task_status = await update_Task_Status(req.query.task_id, "Confirmed")
        if (!update_task_status.success)
        {
            return res.send(update_task_status.error)
        }
        return res.send({
            message: "Không đồng ý hủy task",
            data: update_task_status
        })
    }
}

const confirmTaskPayment = async(req, res) => {
    if (req.query.ans == "YES")
    {
        const update_task_status = await update_Task_Status(req.query.task_id, "Completed")
        console.log("OK")
        if (!update_task_status.success)
        {
            return res.send(update_task_status.error)
        }
        const create_payment = await create_Payment(req, res)
        if (!create_payment.success)
        {
            return res.send(create_payment.error)
        }
        return res.send({ message: "Xác nhận đã thanh toán thành công",success: true, data: [update_task_status.data, create_payment.data]})
    }
    else
    {
        const update_task_status = await update_Task_Status(req.query.task_id, "Payment_wating")
        return res.send({message: "Xác nhận chưa thanh toán", data: update_task_status})
    }
}

const getReviewByTask = async(req, res) => {
    return res.send(await get_Review_by_TaskId(req.query.task_id))
}
module.exports = {
    getBecomeTaskerForm,
    postNewTasker,
    getTasksByTaskerId,
    getTaskbyTaskerId,
    updateTaskerInfo,
    receiveTask,
    getTaskByTaskerIdAndStatus,
    getPendingTaskbyTaskerId,
    confirmTaskCanceling,
    confirmTaskPayment,
    getReviewByTask
}