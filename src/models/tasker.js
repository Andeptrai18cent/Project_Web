const connection = require('../config/database')

class Tasker {
    // Lấy tất cả Taskers
    static async getAllTaskers() {
    const { data, error } = await connection
        .from('Taskers')
        .select(`
            tasker_id,
            hourly_rate,
            actual_income,
            bio,
            Users (
                username,
                name,
                phone_number,
                address
            ),
            ServiceGroup (
                group_name
            )
        `)

    if (error) {
        console.error("Error fetching taskers with details:", error)
        return []
    }
    return data
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

module.exports =  Tasker
