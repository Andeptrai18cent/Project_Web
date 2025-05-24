const connection = require('../config/database')

class Task {
    // Lấy tất cả các công việc với phân trang
    static async getAllTasks(page = 1, limit = 10) {
        // Tính offset
        const offset = (page - 1) * limit;
        
        // Lấy tổng số tasks
        const { count, error: countError } = await connection
            .from('Tasks')
            .select('*', { count: 'exact' });
        
        if (countError) {
            console.error("Error counting tasks:", countError);
            return { tasks: [], total: 0 };
        }

        // Lấy tasks với phân trang
        const { data, error } = await connection
            .from('Tasks')
            .select('*')
            .range(offset, offset + limit - 1)
            .order('task_id', { ascending: true });
        
        if (error) {
            console.error("Error fetching tasks:", error);
            return { tasks: [], total: 0 };
        }
        
        return { tasks: data || [], total: count };
    }

    // Thêm công việc mới
    static async createTask(task) {
        const { data, error } = await connection.from('Tasks').insert([
            {
                user_id: task.user_id,
                service_id: task.service_id,
                description: task.description,
                location: task.location,
                status: task.status,
                created_at: task.created_at,
                tasker_id: task.tasker_id,
                task_date: task.task_date,
            }
        ])
        if (error) {
            console.error("Error inserting task:", error)
            return null
        }
        return data
    }

    // Cập nhật thông tin công việc
    static async updateTask(taskId, updatedData) {
        const { data, error } = await connection
            .from('Tasks')
            .update(updatedData)
            .eq('task_id', taskId)
        if (error) {
            console.error("Error updating task:", error)
            return null
        }
        return data
    }

    // Xóa công việc
    static async deleteTask(taskId) {
        const { data, error } = await connection
            .from('Tasks')
            .delete()
            .eq('task_id', taskId)
        if (error) {
            console.error("Error deleting task:", error)
            return null
        }
        return data
    }
}

module.exports = Task
