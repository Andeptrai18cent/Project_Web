const connection = require('../config/database')

const getAllService = async () => {
    let [result, fields] = await connection.query('select * from services')
    return result
}

const getAllServiceGroup = async () => {
    let [result, fields] = await connection.query('select * from servicegroup')
    return result
}

const getServiceGroupAndService = async () => {
    let [result, fields] = await connection.query
    (
        `select SG.group_name, S.name, SG.group_id, S.service_id from services S 
        join servicegroup SG on SG.group_id = S.group_id`
    )
    return result
}
module.exports = {
    getAllService,
    getAllServiceGroup,
    getServiceGroupAndService
}