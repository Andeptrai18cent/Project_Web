const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const Task = require('../models/task')

const create_Task = async (req, taskData) => {
    try {
        // Extract user_id from cookies
        //const user_id = req.cookies.user_id
        const step1Data = req.session.step1Data
        const user_id_jwt = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        // Prepare task object with data from cookies and passed taskData
        const task = new Task(
            step1Data.service_id, 
            step1Data.description + '\n' + step1Data.workload,
            step1Data.address,
            taskData.tasker_id || null,
            new Date(taskData.task_date).toISOString(),
            user_id_jwt.user_id,
            'Chờ xác nhận', // Default status for new tasks
            new Date().toISOString()
        );

        // const task = new Task(
        //     taskData.service_id,
        //     taskData.description,
        //     taskData.location,
        //     taskData.tasker_id || null,
        //     new Date(taskData.task_date).toISOString(),
        //     user_id_jwt.user_id,
        //     'pending', // Default status for new tasks
        //     new Date().toISOString()
        // );
        //console.log(task)
        // Insert task into the database
        const { data, error } = await connection.from('Tasks').insert(task).select()

        if (error) {
            console.error("Error creating task:", error)
            return { success: false, error }
        }
        //console.log("Data: ", data[0])
        return { success: true, data: data[0] }
    } catch (err) {
        console.error("Exception in createTask:", err)
        return { success: false, error: err.message }
    }
}

const update_Task_Status = async (task_id, status) => {
    try {
        const { data, error } = await connection
            .from('Tasks')
            .update({ status: status })
            .eq('task_id', task_id)
            .select()

        if (error) {
            console.error("Error updating task status:", error)
            return { success: false, error }
        }

        return { success: true, data: data[0] }
    } catch (err) {
        console.error("Exception in updateTaskStatus:", err)
        return { success: false, error: err.message }
    }
        return { success: false, error: "Không có quyền truy cập" }
}

const get_Tasks_By_UserId = async (user_id) => {
    try {
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error getting tasks by user_id:", error)
            return []
        }

        return data
    } catch (err) {
        console.error("Exception in getTasksByUserId:", err)
        return []
    }
}

const get_Tasks_By_TaskerId = async (tasker_id) => {
    try {
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('tasker_id', tasker_id)
            .order('task_date', { ascending: true })

        if (error) {
            console.error("Error getting tasks by tasker_id:", error)
            return []
        }

        return data
    } catch (err) {
        console.error("Exception in getTasksByTaskerId:", err)
        return []
    }
}

module.exports = {
    create_Task,
    update_Task_Status,
    get_Tasks_By_UserId,
    get_Tasks_By_TaskerId,
}