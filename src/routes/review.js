const express = require('express')
const review = express.Router()

const{
    checkReview
} = require('../controllers/userController')

review.get('/review/check-info/:task_id', checkReview)

module.exports = review