const connection = require('../config/database');

class Service {
    static async getAll() {
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
            `);
        if (error) {
            console.error("Lỗi khi lấy danh sách service:", error);
            return [];
        }
        return data;
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
