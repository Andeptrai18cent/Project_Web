const connection = require('../config/database')
const jwt = require('jsonwebtoken');

const create_Report_User = async (req, task_id) => {
    try {
        const { user_id: token_user_id } = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        // Fetch the task from the database
        const task = await connection.from("Tasks").select().eq("task_id", task_id);

        // Check if task exists
        if (!task.data || task.data.length === 0) {
            return { success: false, message: "Task not found" };
        }

        const { user_id, tasker_id } = task.data[0];
        const { report_content } = req.body;

        if (token_user_id !== user_id) {
            return { success: false, message: "Access Denied" };
        }
        // Construct the report object
        const report = {
            user_id,
            tasker_id,
            report_content,
            status: "Waiting",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert the report into the Report table
        const { data, error } = await connection.from('UserReports').insert(report).select();

        if (error) {
            console.error("Error creating report:", error);
            return { success: false, error };
        }

        return { success: true, data: data[0] };

    } catch (err) {
        console.error("Exception in create_Report:", err);
        return { success: false, error: err.message };
    }
};

const create_Report_Tasker = async (req, task_id) => {
    try {
        const { tasker_id: token_tasker_id } = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        // Fetch the task from the database
        const task = await connection.from("Tasks").select().eq("task_id", task_id);

        // Check if task exists
        if (!task.data || task.data.length === 0) {
            return { success: false, message: "Task not found" };
        }

        const { user_id, tasker_id } = task.data[0];
        const { report_content } = req.body;

        if (token_tasker_id !== tasker_id) {
            return { success: false, message: "Access Denied" };
        }
        // Construct the report object
        const report = {
            user_id,
            tasker_id,
            report_content,
            status: "Waiting",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert the report into the Report table
        const { data, error } = await connection.from('UserReports').insert(report).select();

        if (error) {
            console.error("Error creating report:", error);
            return { success: false, error };
        }

        return { success: true, data: data[0] };

    } catch (err) {
        console.error("Exception in create_Report:", err);
        return { success: false, error: err.message };
    }
};
module.exports = {
    create_Report_User,
    create_Report_Tasker
};