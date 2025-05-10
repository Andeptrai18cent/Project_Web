const express = require('express')
const cookieParser = require('cookie-parser'); //Thiết lập gói cookie-parser
const session = require('express-session')

const viewConfig = (app) =>{
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: false, 
            httpOnly: false,
            maxAge: 1000 * 60 * 60
        },
    }))
    // đường dẫn đến folder có các view
    app.set('views', './src/views')
    // Chỉnh loại view engine
    app.set('view engine', 'ejs')
    app.use(cookieParser());
    app.use(express.static('./src/assets'))
}

module.exports = viewConfig