const connection = require('../config/database')
const express = require('express')
const { get } = require('../routes/home')
const app = express()
const {getAllUsers} = require('../services/service')

const getAdminPage = async (req, res) => {
    try {
        // Lấy dữ liệu từ Supabase hoặc cơ sở dữ liệu
        let result = await getAllUsers(); 
        
        // Đảm bảo rằng dữ liệu kết quả không bị null hoặc undefined
        console.log(result);  // In ra kết quả để kiểm tra
        
        // Truyền dữ liệu vào view
        return res.render('index.ejs', { users: result });
      } catch (err) {
        console.error('Error getting users:', err);
        return res.status(500).send('Something went wrong');
      }
}
const getGetTaskPage = (req, res) => {
    res.render('showTaskForCustomer.ejs')
}
module.exports = {
    getAdminPage,
    getGetTaskPage,
}