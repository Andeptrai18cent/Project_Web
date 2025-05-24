const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const Task = require('../models/task')

const get_Task_by_TaskId = async(task_id) => {
    const {data, error} = await connection.from("Tasks").select().eq("task_id", task_id)
    if (error)
        return {success: false, error}
    return data[0]
}
const create_Task = async (req, taskData) => {
    try {
        // Extract user_id from cookies
        //const user_id = req.cookies.user_id
        const step1Data = req.session.step1Data
        const user_id_jwt = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        // Prepare task object with data from cookies and passed taskData
        const task = new Task(
            step1Data.service_id, 
            step1Data.task_description + '\n' + step1Data.workload,
            step1Data.address,
            taskData.tasker_id || null,
            new Date(taskData.task_date).toISOString(),
            user_id_jwt.user_id,
            'Pending', // Default status for new tasks
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
}

const get_Tasks_By_UserId = async (user_id, limit = 10, page = 0) => {
    try {
        const offset = page * limit;
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(limit)
            .range(offset, offset + limit - 1);

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

const get_Tasks_By_TaskerId = async (tasker_id, limit = 10, page = 0) => {
    try {
        const offset = page * limit;
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('tasker_id', tasker_id)
            .order('task_date', { ascending: true })
            .limit(limit)
            .range(offset, offset + limit - 1);

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

const post_working_start_at = async(task_id, req) => {
    try{
        const {error} = await connection
            .from("Tasks")
            .update({work_start_at: new Date().toISOString(), status: "Work_waiting"})
            .eq("task_id", task_id)
        if (error){
            console("Lỗi database khi bắt đầu công việc", error)
            return {success: false, error}
        }
    }
    catch (error){
        console("Lỗi code khi bắt đầu công việc", error)
        return { success: false, error }
    }
    return {success: true, message: "Đã bắt đầu công việc"}
}

const change_task_info = async(task_id, req) => {
    try{
        const task = await get_Task_by_TaskId(task_id)
        if (task.changed)
            return {success: false, error: "Thông tin task chỉ được thay đổi một lần"}
        const {error} = await connection
            .from("Tasks")
            .update(
                {
                    description: req.body.description,
                    location: req.body.location,
                    task_date: new Date(req.body.task_date),
                    changed: true
                }
            )
            .eq("task_id", task_id)
        if (error){
            console.log("Lỗi truy vấn khi chỉnh sửa Task", error)
            return {success: false, error}
        }
    }
    catch (error){
        console.log("Lỗi code khi chỉnh sửa Task", error)
        return { success: false, error }
    }
    return {success: true, message: "Chỉnh sửa thông tin Task thành công"}
}

const post_working_end_at = async(task_id) => {
    try{
        const {error} = await connection
            .from("Tasks")
            .update({work_end_at: new Date().toISOString(), status: "Payment_waiting"})
            .eq("task_id", task_id)
        if (error){
            console("Lỗi truy vấn khi sửa task", error)
            return {success: false, error}
        }
    }
    catch (error){
        console("Lỗi code khi sửa task", error)
        return { success: false, error }
    }
    return {success: true, message: "Đã sửa task"}
}

const get_Tasks_By_TaskerID_And_Status = async (tasker_id, status, limit = 10, page = 0) => {
    try {
        const offset = page * limit;
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('tasker_id', tasker_id)
            .eq('status', status)
            .order('created_at', { ascending: false })
            .limit(limit)
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error getting tasks by tasker_id:", error)
            return []
        }

        return data
    } catch (err) {
        console.error("Exception in getTasksByTaskerIDAndStatus:", err)
        return []
    }
}

const get_Tasks_By_UserID_And_Status = async (user_id, status, limit = 10, page = 0) => {
    try {
        const offset = page * limit;
        const { data, error } = await connection
            .from('Tasks')
            .select()
            .eq('user_id', user_id)
            .eq('status', status)
            .order('created_at', { ascending: false })
            .limit(limit)
            .range(offset, offset + limit - 1);
        if (error) {
            console.error("Error getting tasks by user_id:", error)
            return []
        }

        return data
    } catch (err) {
        console.error("Exception in getTasksByUserIDAndStatus:", err)
        return []
    }
}
module.exports = {
    create_Task,
    update_Task_Status,
    get_Tasks_By_UserId,
    get_Tasks_By_TaskerId,
    post_working_start_at,
    post_working_end_at,
    get_Tasks_By_TaskerID_And_Status,
    get_Tasks_By_UserID_And_Status,
    change_task_info
}