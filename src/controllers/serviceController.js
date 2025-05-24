const connection = require('../config/database')
const express = require('express')
const app = express()
const serviceService = require('../services/service');
const {getServiceGroupAndService,getServiceByID} = require('../services/service')

const getService = async(req, res) => {
    res.send(await getServiceByID(req.params.service_id))
}
const showServiceInfo = async (req, res) => {
    let result = await serviceService.getAllServiceGroup();
    res.render('service_info.ejs', {service_id: req.params.id})
}

const showServiceByServiceGroup = async (req, res) => {
    let result = await getServiceGroupAndService()
    res.render('servicepage.ejs', {services: result})
}
// Controller tìm kiếm dịch vụ
const searchServicesController = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const groupId = req.query.group || null;
        return res.send(JSON.stringify(await serviceService.searchServices(searchTerm, groupId)))
    } catch (error) {
        console.error("Lỗi controller tìm kiếm:", error);
        return res.status(500).render('error', { 
            message: 'Đã xảy ra lỗi khi tìm kiếm dịch vụ' 
        });
    }
}
// Controller gợi ý tìm kiếm
const suggestServices = async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    
    if (searchTerm.length < 2) {
      // Đảm bảo đặt đúng header
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify({ services: [], categories: [] }));
    }
    
    // Tìm dịch vụ phù hợp
    const services = await serviceService.searchServices(searchTerm);
    
    // Tìm nhóm dịch vụ phù hợp
    let categories = [];
    try {
      categories = await connection.from('ServiceGroup')
        .select('group_id, group_name')
        .ilike('group_name', `%${searchTerm}%`)
        .then(response => response.data || []);
    } catch (dbError) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", dbError);
      categories = []; // Đặt thành mảng trống nếu có lỗi
    }
    
    // Đảm bảo đặt đúng header
    res.setHeader('Content-Type', 'application/json');
    // Gửi response dưới dạng string JSON
    return res.send(JSON.stringify({ 
      services: Array.isArray(services) ? services : [], 
      categories: Array.isArray(categories) ? categories : [] 
    }));
  } catch (error) {
    console.error("Lỗi gợi ý tìm kiếm:", error);
    // Đảm bảo đặt đúng header
    res.setHeader('Content-Type', 'application/json');
    // Trả về JSON hợp lệ thay vì render error page
    return res.send(JSON.stringify({ error: 'Lỗi server', services: [], categories: [] }));
  }
};
module.exports = {
    getService,
    showServiceByServiceGroup,
    showServiceInfo,
    searchServicesController,
    suggestServices
}