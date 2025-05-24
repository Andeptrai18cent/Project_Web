const connection = require('../config/database')

class Tasker {
    // Lấy tất cả Taskers với phân trang
    static async getAllTaskers(page = 1, limit = 10) {
        // Tính offset
        const offset = (page - 1) * limit;
        
        // Lấy tổng số taskers
        const { count, error: countError } = await connection
            .from('Taskers')
            .select('*', { count: 'exact' });
        
        if (countError) {
            console.error("Error counting taskers:", countError);
            return { taskers: [], total: 0 };
        }

        // Lấy taskers với phân trang
        const { data, error } = await connection
            .from('Taskers')
            .select(`
                tasker_id,
                user_id,
                hourly_rate,
                actual_income,
                bio,
                Users (
                    user_id,
                    username,
                    name,
                    phone_number,
                    address
                ),
                ServiceGroup (
                    group_name
                )
            `)
            .range(offset, offset + limit - 1)
            .order('tasker_id', { ascending: true });

        if (error) {
            console.error("Error fetching taskers with details:", error);
            return { taskers: [], total: 0 };
        }
        
        return { taskers: data || [], total: count };
    }

    // Thêm method getById
    static async getById(taskerId) {
        const { data, error } = await connection
            .from('Taskers')
            .select(`
                tasker_id,
                user_id,
                hourly_rate,
                actual_income,
                bio,
                Users (
                    user_id,
                    username,
                    name,
                    phone_number,
                    address
                ),
                ServiceGroup (
                    group_name
                )
            `)
            .eq('tasker_id', taskerId)
            .single();
        
        if (error) {
            console.error("Error fetching tasker by ID:", error);
            return null;
        }
        return data;
    }

    // Cập nhật thông tin Tasker
    static async updateTasker(taskerId, updatedData) {
        const { data, error } = await connection
            .from('Taskers')
            .update(updatedData)
            .eq('tasker_id', taskerId);
        if (error) {
            console.error("Error updating tasker:", error);
            return null;
        }
        return data;
    }

    // Xóa Tasker
    static async deleteTasker(taskerId) {
        const { data, error } = await connection
            .from('Taskers')
            .delete()
            .eq('tasker_id', taskerId);
        if (error) {
            console.error("Error deleting tasker:", error);
            return null;
        }
        return data;
    }
}

module.exports = Tasker
