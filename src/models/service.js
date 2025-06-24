const connection = require('../config/database');

class Service {
    static async getAll(page = 1, limit = 10) {
        // Tính offset
        const offset = (page - 1) * limit;
        
        // Lấy tổng số services
        const { count, error: countError } = await connection
            .from('Services')
            .select('*', { count: 'exact' });
        
        if (countError) {
            console.error("Error counting services:", countError);
            return { services: [], total: 0 };
        }

        // Lấy services với phân trang
        const { data, error } = await connection
            .from('Services')
            .select(`
                service_id,
                name,
                description,
                group_id,
                ServiceGroup (
                    group_name
                )
            `)
            .range(offset, offset + limit - 1)
            .order('service_id', { ascending: true });
            
        if (error) {
            console.error("Lỗi khi lấy danh sách service:", error);
            return { services: [], total: 0 };
        }
        
        return { services: data || [], total: count };
    }

    static async getById(id) {
        const { data, error } = await connection
            .from('Services')
            .select('*')
            .eq('service_id', id)
            .single();
        if (error) {
            console.error("Lỗi khi lấy service theo ID:", error);
            throw error;
        }
        return data;
    }

    static async getAllGroups() {
        const { data, error } = await connection
            .from('ServiceGroup')
            .select('group_id, group_name');
        if (error) {
            console.error("Lỗi khi lấy danh sách ServiceGroup:", error);
            throw error;
        }
        return data;
    }

    static async create(data) {
        const { error } = await connection
            .from('Services')
            .insert([data]);
        if (error) {
            console.error("Lỗi khi tạo service:", error);
            throw error;
        }
    }

    static async update(id, { name, description, group_id }) {
        const { error } = await connection
            .from('Services')
            .update({ name, description, group_id })
            .eq('service_id', id);
        if (error) {
            console.error("Lỗi khi cập nhật service:", error);
            throw error;
        }
    }

    static async delete(id) {
        const { error } = await connection
            .from('Services')
            .delete()
            .eq('service_id', id);
        if (error) {
            console.error("Lỗi khi xóa service:", error);
            throw error;
        }
    }
}

module.exports = Service;