// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {getAdminPage, getGetTaskPage} = require('../controllers/adminController')
const {
    verifyTokenAdmin
} = require('../middlerware/verifyToken')

router.get('/', verifyTokenAdmin, adminController.getAdminPage);

//Users
router.get('/user', verifyTokenAdmin, adminController.getAdminUserPage);
router.get('/user/edit/:id', verifyTokenAdmin, adminController.showEditUserForm);
router.post('/user/edit/:id', verifyTokenAdmin, adminController.updateUser);
router.post('/user/delete/:id', verifyTokenAdmin, adminController.deleteUser);

//Taskers
router.get('/tasker', verifyTokenAdmin, adminController.getAdminTaskerPage);
router.get('/tasker/edit/:id', verifyTokenAdmin, adminController.showEditTaskerForm);
router.post('/tasker/edit/:id', verifyTokenAdmin, adminController.updateTasker);
router.post('/tasker/delete/:id', verifyTokenAdmin, adminController.deleteTasker);

//Tasks
router.get('/task', verifyTokenAdmin, adminController.getAdminTaskPage);
router.get('/task/users', verifyTokenAdmin, adminController.getAllUsersWithTaskCount); // Danh sách user với task count
router.get('/task/user/:id', verifyTokenAdmin, adminController.getTasksByUser); // Task theo user ID

//Service
router.get('/service', verifyTokenAdmin, adminController.getAdminServicePage);
router.get('/service/add', verifyTokenAdmin, adminController.showAddServiceForm);
router.post('/service/add', verifyTokenAdmin, adminController.addService);
router.get('/service/edit/:id', verifyTokenAdmin, adminController.showEditServiceForm);
router.post('/service/edit/:id', verifyTokenAdmin, adminController.updateService);
router.post('/service/delete/:id', verifyTokenAdmin, adminController.deleteService);

//Revenue
router.get('/revenue', verifyTokenAdmin, adminController.getAdminRevenuePage);
router.get('/revenue/tasker/:id', verifyTokenAdmin, adminController.getRevenueByTasker);
router.get('/revenue/summary', verifyTokenAdmin, adminController.getRevenueSummary);

module.exports = router;