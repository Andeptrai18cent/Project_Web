const express = require('express')
const connection = require('./config/database')
const viewConfig = require('./config/viewConfig')

const home = require("./routes/home")
const service = require("./routes/service")
const orderTask = require('./routes/orderTask')
const admin = require('./routes/admin')
const auth = require('./routes/auth')
const tasker = require('./routes/tasker')
const app = express()
const port = process.env.port || 1234

viewConfig(app)

// nhận thông tin từ HTML
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('', home)
app.use('', service)
app.use('', orderTask)
app.use('', admin)
app.use('', auth)
app.use('', tasker)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})