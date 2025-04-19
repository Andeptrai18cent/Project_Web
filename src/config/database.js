const mysql = require('mysql2/promise')
require("dotenv").config()

// const connection = mysql.createPool({
//   host: process.env.db_host,
//   user: process.env.db_user,
//   database: process.env.db_name,
//   password: process.env.db_password,
//   port: process.env.db_port,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// })

const connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
module.exports = connection