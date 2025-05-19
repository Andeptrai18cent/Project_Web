// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdminPage);

// Route để hiển thị Users
router.get('/user', adminController.getAdminUserPage);
router.get('/user/edit/:id', adminController.showEditUserForm);
router.post('/user/edit/:id', adminController.updateUser);
router.post('/user/delete/:id', adminController.deleteUser);




// Route để hiển thị Taskers
router.get('/tasker', adminController.getAdminTaskerPage);
router.get('/taskers/edit/:id', adminController.showEditTaskerForm);
router.post('/tasker/edit/:id', adminController.updateTasker);
router.post('/tasker/delete/:id', adminController.deleteTasker);



// Route để hiển thị Tasks
router.get('/task', adminController.getAdminTaskPage);

//Service
router.get('/service', adminController.getAdminServicePage);
router.get('/service/add', adminController.showAddServiceForm);
router.post('/service/add', adminController.addService);
router.get('/service/edit/:id', adminController.showEditServiceForm);
router.post('/service/edit/:id', adminController.updateService);
router.post('/service/delete/:id', adminController.deleteService);



module.exports = router;
