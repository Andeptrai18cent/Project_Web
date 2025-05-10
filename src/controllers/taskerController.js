const connection = require('../config/database')
const {getAllServiceGroup} = require('../services/service')
const jwt = require('jsonwebtoken');
const {get_Tasks_By_TaskerId} = require('../services/task')
const getBecomeTaskerForm = async (req, res) => {
    let result = await getAllServiceGroup()
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    res.render('DkyTasker.ejs', {service_groups: result, user_id: user_id})
}

const postNewTasker = async(req, res) => {
    //return res.send(req.body.location + " " + req.body.service_group_id)
    const user_id = req.params.user_id
    const {data} = await connection.from("ServiceGroup").select().eq('group_id', req.body.service_group_id)
    if (data)
    {
        var existedTasker = await connection.from("Taskers").select("user_id").eq("user_id", user_id)
        if (existedTasker.data.length)
            return res.status(402).send("Tài khoản đã đăng ký trở thành Tasker, vui lòng dùng tài khoản khác")
        const {error} = await connection.from("Taskers").insert({user_id: user_id, bio: "New tasker", hourly_rate: data[0].hourly_wage, actual_income: 0, service_group_id: req.body.service_group_id})
        if (error)
        {
            console.log(error)
            return res.status(401).send("Không tạo được tasker mới")
        }
        res.send("Tạo tasker mới thành công")
    }
    else             
        return res.status(404).send("Nhóm dịch vụ không tồn tại")
    //res.redirect('/')
}

const getTasksByTaskerId = async(req, res) => {
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
    console.log("Tasker id: ", tasker_id)
    return res.send(await get_Tasks_By_TaskerId(tasker_id))
}
module.exports = {
    getBecomeTaskerForm,
    postNewTasker,
    getTasksByTaskerId
}