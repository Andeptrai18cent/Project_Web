const connection = require('../config/database');

class Revenue {
    // Lấy tất cả revenue với phân trang
    static async getAllRevenues(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        // Lấy tổng số records
        const { count, error: countError } = await connection
            .from('Tasks')
            .select('*', { count: 'exact' })
            .not('work_start_at', 'is', null)
            .not('work_end_at', 'is', null);
        
        if (countError) {
            console.error("Error counting revenues:", countError);
            return { revenues: [], total: 0 };
        }

        // Query để tính lương
        const { data, error } = await connection
            .from('Tasks')
            .select(`
                task_id,
                tasker_id,
                work_start_at,
                work_end_at,
                location,
                description,
                Taskers (
                    tasker_id,
                    hourly_rate,
                    Users (
                        name,
                        username
                    )
                ),
                Users (
                    name,
                    username
                ),
                Services (
                    name
                )
            `)
            .not('work_start_at', 'is', null)
            .not('work_end_at', 'is', null)
            .range(offset, offset + limit - 1)
            .order('task_id', { ascending: false });

        if (error) {
            console.error("Error fetching revenues:", error);
            return { revenues: [], total: 0 };
        }

        // Tính toán lương cho từng task
        const revenues = data.map(task => {
            const startTime = new Date(task.work_start_at);
            const endTime = new Date(task.work_end_at);
            const hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
            const totalRevenue = hoursWorked * task.Taskers.hourly_rate;

            return {
                task_id: task.task_id,
                tasker_id: task.tasker_id, // Thêm dòng này
                tasker_name: task.Taskers.Users.name,
                tasker_username: task.Taskers.Users.username,
                client_name: task.Users.name,
                service_name: task.Services.name,
                work_start_at: task.work_start_at,
                work_end_at: task.work_end_at,
                hours_worked: parseFloat(hoursWorked.toFixed(2)),
                hourly_rate: task.Taskers.hourly_rate,
                total_revenue: parseFloat(totalRevenue.toFixed(2)),
                location: task.location,
                description: task.description
            };
        });
        
        return { revenues, total: count };
    }

    // THÊM METHOD NÀY - Lấy revenue theo tasker ID
    static async getRevenueByTaskerId(taskerId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        const { count, error: countError } = await connection
            .from('Tasks')
            .select('*', { count: 'exact' })
            .eq('tasker_id', taskerId)
            .not('work_start_at', 'is', null)
            .not('work_end_at', 'is', null);
        
        if (countError) {
            console.error("Error counting tasker revenues:", countError);
            return { revenues: [], total: 0 };
        }

        const { data, error } = await connection
            .from('Tasks')
            .select(`
                task_id,
                tasker_id,
                work_start_at,
                work_end_at,
                location,
                description,
                Taskers (
                    tasker_id,
                    hourly_rate,
                    Users (
                        name,
                        username
                    )
                ),
                Users (
                    name,
                    username
                ),
                Services (
                    name
                )
            `)
            .eq('tasker_id', taskerId)
            .not('work_start_at', 'is', null)
            .not('work_end_at', 'is', null)
            .range(offset, offset + limit - 1)
            .order('task_id', { ascending: false });

        if (error) {
            console.error("Error fetching tasker revenues:", error);
            return { revenues: [], total: 0 };
        }

        const revenues = data.map(task => {
            const startTime = new Date(task.work_start_at);
            const endTime = new Date(task.work_end_at);
            const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
            const totalRevenue = hoursWorked * task.Taskers.hourly_rate;

            return {
                task_id: task.task_id,
                tasker_id: task.tasker_id,
                tasker_name: task.Taskers.Users.name,
                client_name: task.Users.name,
                service_name: task.Services.name,
                work_start_at: task.work_start_at,
                work_end_at: task.work_end_at,
                hours_worked: parseFloat(hoursWorked.toFixed(2)),
                hourly_rate: task.Taskers.hourly_rate,
                total_revenue: parseFloat(totalRevenue.toFixed(2)),
                location: task.location,
                description: task.description
            };
        });
        
        return { revenues, total: count };
    }

    // THÊM METHOD NÀY - Tính tổng doanh thu theo tasker
    static async getTotalRevenueByTasker() {
        try {
            const { data, error } = await connection
                .from('Tasks')
                .select(`
                    tasker_id,
                    work_start_at,
                    work_end_at,
                    Taskers (
                        hourly_rate,
                        Users (
                            name,
                            username
                        )
                    )
                `)
                .not('work_start_at', 'is', null)
                .not('work_end_at', 'is', null);

            if (error) {
                console.error("Error calculating total revenue:", error);
                return [];
            }

            // Group by tasker và tính tổng
            const revenueMap = {};
            data.forEach(task => {
                const taskerId = task.tasker_id;
                const startTime = new Date(task.work_start_at);
                const endTime = new Date(task.work_end_at);
                const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
                const revenue = hoursWorked * task.Taskers.hourly_rate;

                if (!revenueMap[taskerId]) {
                    revenueMap[taskerId] = {
                        tasker_id: taskerId,
                        tasker_name: task.Taskers.Users.name,
                        tasker_username: task.Taskers.Users.username,
                        total_hours: 0,
                        total_revenue: 0,
                        task_count: 0
                    };
                }

                revenueMap[taskerId].total_hours += hoursWorked;
                revenueMap[taskerId].total_revenue += revenue;
                revenueMap[taskerId].task_count += 1;
            });

            return Object.values(revenueMap).map(item => ({
                ...item,
                total_hours: parseFloat(item.total_hours.toFixed(2)),
                total_revenue: parseFloat(item.total_revenue.toFixed(2))
            }));
        } catch (error) {
            console.error("Error in getTotalRevenueByTasker:", error);
            return [];
        }
    }
}

module.exports = Revenue;