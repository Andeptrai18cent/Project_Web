const connection = require('../config/database')
const jwt = require('jsonwebtoken');

const get_user_info = async(req) => {
  try {
    const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);

    const { data, error } = await connection
      .from('Users')
      .select('user_id, email, name, phone_number, address')
      .eq('user_id', user_id)
      .single();

    if (error || !data) {
      return { message: 'User not found', error };
    }
    return {message: "OK" , data: data};
    } catch (err) {
    return { message: 'Invalid or expired token', error: err.message };
  }
};

module.exports = {
    get_user_info
}