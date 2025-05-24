const {
    create_Report_User,
    create_Report_Tasker
} = require('../services/report');

const createReportUser = async (req, res) => {
    const task_id = req.query.task_id;
    const result = await create_Report_User(req, task_id);
    return res.send(JSON.stringify(result));
};

const createReportTasker = async (req, res) => {
    const task_id = req.query.task_id;
    const result = await create_Report_Tasker(req, task_id);
    return res.send(JSON.stringify(result));
};

module.exports = {
    createReportUser,
    createReportTasker
};