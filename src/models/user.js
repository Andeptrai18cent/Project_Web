const connection = require('../config/database')

class User {
    constructor(email, name, phone_number, username, password, address) {
      this.email = email 
      this.name = name
      this.phone_number = phone_number
      this.username = username
      this.password = password
      this.address = address
    }
    static async getAllUsers(page = 1, limit = 10) {
        // Tính offset
        const offset = (page - 1) * limit;
        
        // Lấy tổng số users
        const { count, error: countError } = await connection
            .from('Users')
            .select('*', { count: 'exact' });
        
        if (countError) {
            console.error("Error counting users:", countError);
            return { users: [], total: 0 };
        }

        // Lấy users với phân trang
        const { data, error } = await connection
            .from('Users')
            .select('*')
            .range(offset, offset + limit - 1)
            .order('user_id', { ascending: true });
        
        if (error) {
            console.error("Error fetching users:", error);
            return { users: [], total: 0 };
        }
        
        return { users: data || [], total: count };
    }

    static async getById(userId) {
        const { data, error } = await connection
            .from('Users')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
        return data;
    }

    static async createUser(user) {
        const { data, error } = await connection.from('Users').insert([
            {
                email: user.email,
                name: user.name,
                phone_number: user.phone_number,
                username: user.username,
                password: user.password,
                address: user.address,
            }
        ])
        if (error) {
            console.error("Error inserting user:", error)
            return null
        }
        return data
    }

    static async updateUser(userId, updatedData) {
        const { data, error } = await connection
            .from('Users')
            .update(updatedData)
            .eq('user_id', userId)
        if (error) {
            console.error("Error updating user:", error)
            return null
        }
        return data
    }

    static async deleteUser(userId) {
        const { data, error } = await connection
            .from('Users')
            .delete()
            .eq('user_id', userId)
        if (error) {
            console.error("Error deleting user:", error)
            return null
        }
        return data
    }
}

module.exports = User