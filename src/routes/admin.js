// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {getAdminPage, getGetTaskPage} = require('../controllers/adminController')

router.get('/', adminController.getAdminPage);

//Users
router.get('/user', adminController.getAdminUserPage);
router.get('/user/edit/:id', adminController.showEditUserForm);
router.post('/user/edit/:id', adminController.updateUser);
router.post('/user/delete/:id', adminController.deleteUser);

//Taskers
router.get('/tasker', adminController.getAdminTaskerPage);
router.get('/tasker/edit/:id', adminController.showEditTaskerForm);
router.post('/tasker/edit/:id', adminController.updateTasker);
router.post('/tasker/delete/:id', adminController.deleteTasker);

//Tasks
router.get('/task', adminController.getAdminTaskPage);
router.get('/task/users', adminController.getAllUsersWithTaskCount); // Danh sách user với task count
router.get('/task/user/:id', adminController.getTasksByUser); // Task theo user ID

//Service
router.get('/service', adminController.getAdminServicePage);
router.get('/service/add', adminController.showAddServiceForm);
router.post('/service/add', adminController.addService);
router.get('/service/edit/:id', adminController.showEditServiceForm);
router.post('/service/edit/:id', adminController.updateService);
router.post('/service/delete/:id', adminController.deleteService);

//Revenue
router.get('/revenue', adminController.getAdminRevenuePage);
router.get('/revenue/tasker/:id', adminController.getRevenueByTasker);
router.get('/revenue/summary', adminController.getRevenueSummary);

module.exports = router;