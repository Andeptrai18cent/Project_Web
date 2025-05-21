const connection = require('../config/database')

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
    getAllServiceGroup,
    getServiceGroupAndService,
    getServiceGroupFromService,
    getServiceByID
}