const connection = require('../config/database')

class User {
    static async getAllUsers() {
        const { data, error } = await connection.from('Users').select()
        if (error) {
            console.error("Error fetching users:", error)
            return []
        }
        return data
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
