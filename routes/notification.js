// routes/notification.js
const express = require('express')
const router = express.Router()
const NotificationController = require('../controllers/notificationController')

// API endpoints
router.get('/notifications/history', NotificationController.getNotifications)
module.exports = router