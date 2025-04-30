const connection = require('../config/database')

const getAllService = async () => {
    let {data} = await connection.from('Services').select()
    //let [result, fields] = await connection.query('select * from services')
    return data
}

const getAllServiceGroup = async () => {
    //let [result, fields] = await connection.query('select * from servicegroup')
    let {data} = await connection.from('ServiceGroup').select()
    return data
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
    getAllService,
    getAllServiceGroup,
    getServiceGroupAndService
}