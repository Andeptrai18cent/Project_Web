const express = require('express')
const cookieParser = require('cookie-parser'); //Thiết lập gói cookie-parser

const viewConfig = (app) =>{
    // đường dẫn đến folder có các view
    app.set('views', './src/views')
    // Chỉnh loại view engine
    app.set('view engine', 'ejs')
    app.use(cookieParser());
    app.use(express.static('./src/assets'))
}

module.exports = viewConfig