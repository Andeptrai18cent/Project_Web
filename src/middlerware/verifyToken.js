const jwt = require('jsonwebtoken');
const connection = require('../config/database')
const verifyTokenUser = async (req, res, next) => {
    const token = req.cookies.token
    //console.log(token)
    if (!token)
        res.redirect('/login')

    try {
        const {user_id} = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!user_id)
            return res.status(400).send('Invalid Token')
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}

const verifyTokenTasker = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).send('Access Denied');

    try {
        const {tasker_id} = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!tasker_id)
            return res.status(400).send('Invalid Token')
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}
const verifyTokenUser_Task = async (req, res, next) => {
    const token = req.cookies.token
    //console.log(token)
    if (!token) return res.status(401).send('Access Denied');
    try {
        const {user_id} = jwt.verify(token, process.env.TOKEN_SECRET);
        const {data, error} = await connection.from("Tasks").select("user_id").eq("task_id", req.query.task_id)
        if (error || user_id != data[0].user_id || !user_id)
            return res.status(400).send('Invalid Token')
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}

const verifyTokenTasker_Task = async (req, res, next) => {
    const token = req.cookies.token
    //console.log(token)
    if (!token) return res.status(401).send('Access Denied');
    try {
        const {tasker_id} = jwt.verify(token, process.env.TOKEN_SECRET);
        const {data, error} = await connection.from("Tasks").select("tasker_id").eq("task_id", req.query.task_id)
        if (error || tasker_id != data[0].tasker_id || !tasker_id)
            return res.status(400).send('Invalid Token')
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}
const getToken = async (req, res, next) => {
    const token = req.cookies.token
    //console.log(token)
    if (!token)
        return res.send({
            user_id: undefined,
            tasker_id: undefined
        })

    try {
        const {user_id, tasker_id} = jwt.verify(token, process.env.TOKEN_SECRET);
        return res.send({
            user_id: user_id,
            tasker_id: tasker_id
        })
    } catch (err) {
        return res.send({
            user_id: undefined,
            tasker_id: undefined
        })
    }
}
module.exports = {
    verifyTokenUser,
    verifyTokenTasker,
    verifyTokenUser_Task,
    verifyTokenTasker_Task,
    getToken
}