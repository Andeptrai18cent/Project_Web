const connection = require('../config/database')

class Report{
    static async getAllReport(){
         const { data, error } = await connection.from('UserReports').select()
        if (error) {
            console.error("Error fetching tasks:", error)
            return []
        }
        return data
    }
 
}