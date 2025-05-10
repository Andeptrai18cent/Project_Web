const {
    create_Payment
} = require('../services/payment')
const createPayment = async (req, res) => {
    return res.send(JSON.stringify(await create_Payment(req, res)))
}
module.exports = {
    createPayment
}