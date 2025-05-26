const connection = require('../config/database')
const Review = require('../models/review')
const jwt = require('jsonwebtoken');

const create_Review = async (req) => {
    try {
        const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        //return {minute: req.body.minute, hour: req.body.hour, taskerEarning: taskerEarning, actual_income: tasker.data[0].actual_income}
        const review = new Review(
            req.query.task_id,
            user_id,
            req.body.rating,
            req.body.review_content
        );

        const { data, error } = await connection.from('Review').insert(review).select()
        if (error) {
            console.error("Lỗi database khi tạo đánh giá", error)
            return { success: false, error }
        }

        return { success: true, data: data[0] }
    } catch (err) {
        console.error("Lỗi server khi tạo đánh giá", err)
        return { success: false, error: err.message }
    }
}

const get_Review_by_TaskId = async(task_id) => {
    try{
        const {data, error} = await connection.from("Review").select().eq("task_id", task_id).single().limit(1)
        if (error) {
            console.log("Task_id:", task_id)
            console.error("Lỗi database khi lấy đánh giá", error)
            return { success: false, error }
        }

        return { success: true, data: data }
    }
    catch (err) {
        console.error("Lỗi server khi lấy đánh giá", err)
        return { success: false, error: err.message }
    }
}
module.exports = {
    create_Review,
    get_Review_by_TaskId
}