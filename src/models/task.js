const connection = require('../config/database')

class Task {
    constructor(service_id, description, location, tasker_id, task_date, user_id, status, created_at) {
        this.service_id = service_id;
        this.description = description;
        this.location = location;
        this.tasker_id = tasker_id;
        this.task_date = task_date;
        this.user_id = user_id;
        this.status = status;
        this.created_at = created_at;
    }

    // Lấy tất cả tasks
    static async getAllTasks(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        try {
            const { count, error: countError } = await connection
                .from('Tasks')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                console.error("Error counting tasks:", countError);
                return { tasks: [], total: 0 };
            }

            const { data, error } = await connection
                .from('Tasks')
                .select(`
                    task_id,
                    user_id,
                    tasker_id,
                    service_id,
                    description,
                    location,
                    task_date,
                    work_start_at,
                    work_end_at,
                    status,
                    Services!inner (
                        name,
                        description
                    ),
                    Users!inner (
                        name,
                        username
                    ),
                    Taskers (
                        Users!inner (
                            name,
                            username
                        )
                    )
                `)
                .range(offset, offset + limit - 1)
                .order('task_date', { ascending: false });

            if (error) {
                console.error("Error fetching tasks:", error);
                return { tasks: [], total: 0 };
            }

            return { tasks: data || [], total: count || 0 };
        } catch (error) {
            console.error("Exception in getAllTasks:", error);
            return { tasks: [], total: 0 };
        }
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

    // Lấy tất cả user với số lượng task của họ
    static async getAllUsersWithTaskCount(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        try {
            // Lấy danh sách user với số lượng task (THÊM phone_number)
            const { data, error } = await connection
                .from('Users')
                .select(`
                    user_id,
                    name,
                    username,
                    email,
                    phone_number,
                    Tasks!left (
                        task_id,
                        status
                    )
                `)
                .range(offset, offset + limit - 1)
                .order('name');

            if (error) {
                console.error("Error fetching users with task count:", error);
                return { users: [], total: 0 };
            }

            // Đếm tổng số user
            const { count, error: countError } = await connection
                .from('Users')
                .select('*', { count: 'exact', head: true });

            // Format data với thống kê task
            const formattedUsers = (data || []).map(user => {
                const tasks = user.Tasks || [];
                const taskCount = tasks.length;
                const completedTasks = tasks.filter(task => task.status === 'Completed').length;
                const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
                const inProgressTasks = tasks.filter(task => task.status === 'In_Progress').length;

                return {
                    user_id: user.user_id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number, // THAY ĐỔI từ phone thành phone_number
                    total_tasks: taskCount,
                    completed_tasks: completedTasks,
                    pending_tasks: pendingTasks,
                    in_progress_tasks: inProgressTasks
                };
            });

            return { users: formattedUsers, total: count || 0 };
        } catch (error) {
            console.error("Exception in getAllUsersWithTaskCount:", error);
            return { users: [], total: 0 };
        }
    }

    // Lấy task theo user ID
    static async getTasksByUserId(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        try {
            // Đếm tổng số task của user
            const { count, error: countError } = await connection
                .from('Tasks')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            
            if (countError) {
                console.error("Error counting user tasks:", countError);
                return { tasks: [], total: 0 };
            }

            // Lấy danh sách task với thông tin join (BỎ base_price)
            const { data, error } = await connection
                .from('Tasks')
                .select(`
                    task_id,
                    user_id,
                    tasker_id,
                    service_id,
                    description,
                    location,
                    task_date,
                    work_start_at,
                    work_end_at,
                    status,
                    Services!inner (
                        service_id,
                        name,
                        description
                    ),
                    Users!inner (
                        name,
                        username,
                        email,
                        phone_number
                    ),
                    Taskers (
                        Users!inner (
                            name,
                            username
                        )
                    )
                `)
                .eq('user_id', userId)
                .range(offset, offset + limit - 1)
                .order('task_date', { ascending: false });

            if (error) {
                console.error("Error fetching user tasks:", error);
                return { tasks: [], total: 0 };
            }

            return { tasks: data || [], total: count || 0 };
        } catch (error) {
            console.error("Exception in getTasksByUserId:", error);
            return { tasks: [], total: 0 };
        }
    }
}

module.exports = Task