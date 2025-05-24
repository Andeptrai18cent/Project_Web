const connection = require('../config/database')
const express = require('express')
const app = express()
const serviceService = require('../services/service');
const {getAllService,getAllServiceGroup,getServiceGroupAndService} = require('../services/service')

const getAllServiceGroup = async () => {
    //let [result, fields] = await connection.query('select * from servicegroup')
    let {data} = await connection.from('ServiceGroup').select()
    return data
}

const getServiceByID = async(service_id) => {
    let {data} = await connection.from("Services").select().eq("service_id", service_id).single()
    return data
}
const getServiceGroupFromService = async (service_id) => {
    const {data} = await connection.from("Services").select("group_id").eq("service_id", service_id)
    return data[0].group_id
}


// Hàm tìm kiếm dịch vụ theo tên
const searchServices = async (searchTerm, groupId = null) => {
    let query = connection.from('Services')
        .select(`
            service_id,
            name,
            description,
            group_id,
            ServiceGroup (group_name)
        `)
        .ilike('name', `%${searchTerm}%`);
    
    // Nếu có chọn nhóm dịch vụ cụ thể
    if (groupId) {
        query = query.eq('group_id', groupId);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error("Lỗi tìm kiếm:", error);
        return [];
    }
    
    return data;
}

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
const getServiceGroupAndService = async () => {
    //let [result, fields] = await connection.query
    // (
    //     `select SG.group_name, S.name, SG.group_id, S.service_id from services S 
    //     join servicegroup SG on SG.group_id = S.group_id`
    // )
    let {data} = await connection.from('ServiceGroup').select(
        `group_name,
        group_id,
        Services (name, service_id, group_id)
        `
    )
    //console.log(data)
    return data
}
module.exports = {
    searchServices,
    suggestServices,
    getAllServiceGroup,
    getServiceGroupAndService,

}