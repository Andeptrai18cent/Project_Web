const User = require('../models/user')
const Task = require('../models/task')
const Tasker = require('../models/tasker')
const ServiceModel = require('../models/service')
const Revenue = require('../models/revenue')

class AdminController {
    // Hiển thị trang Admin với các phần Quản lý User, Task, Tasker
    getAdminPage(req, res) {
        res.render('admin/dashboard/dashboard.ejs');
    }

    async getAdminUserPage(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Hiển thị 5 users mỗi trang
            
            const { users, total } = await User.getAllUsers(page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/user/user.ejs', { users, pagination });
        } catch (error) {
            console.error("Error loading users page:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async getAdminTaskerPage(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Hiển thị 5 taskers mỗi trang
            
            const { taskers, total } = await Tasker.getAllTaskers(page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalTaskers: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/tasker/tasker.ejs', { taskers, pagination });
        } catch (error) {
            console.error("Error loading taskers page:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async getAdminTaskPage(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Hiển thị 5 tasks mỗi trang
            
            const { tasks, total } = await Task.getAllTasks(page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalTasks: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/task/task.ejs', { tasks, pagination });
        } catch (error) {
            console.error("Error loading tasks page:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async getAdminServicePage(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Hiển thị 5 services mỗi trang
            
            const { services, total } = await ServiceModel.getAll(page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalServices: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/service/service.ejs', { services, pagination });
        } catch (error) {
            console.error("Error loading service page:", error);
            res.status(500).send("Lỗi server");
        }
    }

    // User CRUD methods
    async showEditUserForm(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.getById(userId);
            if (!user) {
                return res.status(404).send("Không tìm thấy user");
            }
            res.render('admin/user/edit', { user });
        } catch (error) {
            console.error("Error loading edit user form:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { username, name, address, phone_number } = req.body;

            await User.updateUser(userId, {
                username,
                name,
                address,
                phone_number
            });

            res.redirect('/admin/user');
        } catch (error) {
            console.error("Update user failed:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await User.deleteUser(userId);
            res.redirect('/admin/user');
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Tasker CRUD methods
    // filepath: d:\HomeTask\Project_Web\src\controllers\adminController.js
// Tasker CRUD methods
async showEditTaskerForm(req, res) {
    try {
        const taskerId = req.params.id;
        const tasker = await Tasker.getById(taskerId);
        if (!tasker) {
            return res.status(404).send("Không tìm thấy tasker");
        }
        res.render('admin/tasker/edit', { tasker });
    } catch (error) {
        console.error("Error loading edit tasker form:", error);
        res.status(500).send("Lỗi server");
    }
}

    async updateTasker(req, res) {
        try {
            const taskerId = req.params.id;
            const { name, phone_number, address, hourly_rate, bio } = req.body;

            // Lấy thông tin tasker trước
            const tasker = await Tasker.getById(taskerId);
            if (!tasker) {
                return res.status(404).send("Không tìm thấy tasker");
            }

            // Update user info sử dụng user_id từ tasker hoặc từ Users object
            const userId = tasker.user_id || tasker.Users.user_id;
            
            if (userId) {
                await User.updateUser(userId, {
                    name,
                    phone_number,
                    address
                });
            }

            // Update tasker info
            await Tasker.updateTasker(taskerId, {
                hourly_rate: parseFloat(hourly_rate),
                bio
            });

            res.redirect('/admin/tasker');
        } catch (error) {
            console.error("Error updating tasker:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async deleteTasker(req, res) {
        try {
            const taskerId = req.params.id;
            await Tasker.deleteTasker(taskerId);
            res.redirect('/admin/tasker');
        } catch (error) {
            console.error("Error deleting tasker:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    // Service CRUD methods
    async showAddServiceForm(req, res) {
        try {
            const groups = await ServiceModel.getAllGroups();
            res.render('admin/service/add.ejs', { groups });
        } catch (error) {
            console.error("Lỗi khi load form thêm service:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async addService(req, res) {
        try {
            await ServiceModel.create(req.body);
            res.redirect('/admin/service');
        } catch (error) {
            console.error("Lỗi thêm service:", error);
            res.status(500).send("Lỗi thêm service");
        }
    }

    async showEditServiceForm(req, res) {
        try {
            const id = req.params.id;
            const service = await ServiceModel.getById(id);
            if (!service) {
                return res.status(404).send('Không tìm thấy service');
            }

            const groups = await ServiceModel.getAllGroups();
            res.render('admin/service/edit', { service, groups });
        } catch (error) {
            console.error("Error loading edit form:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async updateService(req, res) {
        try {
            const id = req.params.id;
            await ServiceModel.update(id, req.body);
            res.redirect('/admin/service');
        } catch (error) {
            console.error("Lỗi cập nhật service:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async deleteService(req, res) {
        try {
            const id = req.params.id;
            await ServiceModel.delete(id);
            res.redirect('/admin/service');
        } catch (error) {
            console.error("Lỗi xóa service:", error);
            res.status(500).send("Lỗi server");
        }
    }

    // Revenue CRUD methods
    async getAdminRevenuePage(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10; // Hiển thị 10 revenues mỗi trang
            
            const { revenues, total } = await Revenue.getAllRevenues(page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalRevenues: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/revenue/revenue.ejs', { revenues, pagination });
        } catch (error) {
            console.error("Error loading revenues page:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async getRevenueByTasker(req, res) {
        try {
            const taskerId = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            
            const { revenues, total } = await Revenue.getRevenueByTaskerId(taskerId, page, limit);
            const totalPages = Math.ceil(total / limit);
            
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                totalRevenues: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                limit: limit
            };
            
            res.render('admin/revenue/tasker-revenue.ejs', { revenues, pagination, taskerId });
        } catch (error) {
            console.error("Error loading tasker revenues:", error);
            res.status(500).send("Lỗi server");
        }
    }

    async getRevenueSummary(req, res) {
        try {
            const summaryData = await Revenue.getTotalRevenueByTasker();
            res.render('admin/revenue/summary.ejs', { summaryData });
        } catch (error) {
            console.error("Error loading revenue summary:", error);
            res.status(500).send("Lỗi server");
        }
    }

    // Additional methods that might be missing
    async getAllUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error("Error getting all users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await Task.getAllTasks();
            res.json(tasks);
        } catch (error) {
            console.error("Error getting all tasks:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllTaskers(req, res) {
        try {
            const taskers = await Tasker.getAllTaskers();
            res.json(taskers);
        } catch (error) {
            console.error("Error getting all taskers:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new AdminController()