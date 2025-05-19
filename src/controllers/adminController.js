const User = require('../models/user')
const Task = require('../models/task')
const Tasker = require('../models/tasker')
const ServiceModel = require('../models/service')



class AdminController {
    // Hiển thị trang Admin với các phần Quản lý User, Task, Tasker
    getAdminPage(req, res) {
        res.render('admin/dashboard/dashboard.ejs');
    }

     async getAdminUserPage(req, res) {
        const users = await User.getAllUsers();
        res.render('admin/user/user.ejs', {users});
    }

    async getAdminTaskerPage(req, res) {
        const taskers = await Tasker.getAllTaskers();
        res.render('admin/tasker/tasker.ejs', {taskers});
    }

    async getAdminTaskPage(req, res) {
        const tasks = await Task.getAllTasks();
        res.render('admin/task/task.ejs', {tasks});
    }


    async getAdminServicePage (req, res) {
        try {
            const services = await ServiceModel.getAll();
            res.render('admin/service/service', { services });
        } catch (error) {
            console.error("Error loading service page:", error);
            res.status(500).send("Lỗi server");
        }
    };


    // Quản lý User
    async showEditUserForm(req, res) {
    const userId = req.params.id;
    const user = await User.getById(userId);
    if (!user) return res.status(404).send("Không tìm thấy user");
    res.render('admin/user/edit', { user });
}

    // Quản lý Service
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
            if (!service) return res.status(404).send('Không tìm thấy service');

            const groups = await ServiceModel.getAllGroups(); // Lấy danh sách ServiceGroup
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

    // Quản lý User (có thể thêm, sửa, xóa nếu cần)
    async getAllUsers(req, res) {
        try {
            const keyword = req.query.keyword?.trim();
            const allUsers = await User.getAllUsers();

            let users = allUsers;

            if (keyword) {
                users = allUsers.filter(user =>
                    String(user.user_id).includes(keyword)
                );
            }

            res.render('crudusers', { users, section: 'user' });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }


    // Quản lý Task (có thể thêm, sửa, xóa nếu cần)
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.getAllTasks()
            res.render('crudtasks', { tasks, section: 'task' }) // Truyền section là 'task'
        } catch (error) {
            console.error("Error fetching tasks:", error)
            res.status(500).send("Internal Server Error")
        }
    }

    // Quản lý Tasker (có thể thêm, sửa, xóa nếu cần)
    async getAllTaskers(req, res) {
        try {
            const keyword = req.query.keyword?.trim();
            const allTaskers = await Tasker.getAllTaskers();

            let taskers = allTaskers;

            if (keyword) {
                taskers = allTaskers.filter(tasker =>
                    String(tasker.tasker_id).includes(keyword) || 
                    tasker.name?.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            res.render('crudtaskers', { taskers, section: 'tasker', keyword });
        } catch (error) {
            console.error("Error fetching taskers:", error);
            res.status(500).send("Internal Server Error");
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

            res.redirect('/admin/user'); // Load lại danh sách
        } catch (error) {
            console.error("Update user failed:", error);
            res.status(500).send("Internal Server Error");
        }
    }


    async showEditTaskerForm(req, res) {
        try {
            const taskerId = req.params.id;
            const tasker = await Tasker.getById(taskerId);
            if (!tasker) return res.status(404).send('Không tìm thấy tasker');

            res.render('admin/tasker/edit', { tasker });
        } catch (error) {
            console.error("Error loading tasker edit form:", error);
            res.status(500).send("Lỗi server");
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
    async updateTasker(req, res) {
        const taskerId = req.params.id;
        const updatedData = {
            name: req.body.name,
            phone_number: req.body.phone_number,
            // thêm các trường khác nếu có
        };

        try {
            await Tasker.updateTasker(taskerId, updatedData);
            res.redirect('/admin/tasker');
        } catch (error) {
            console.error("Error editing tasker:", error);
            res.status(500).send("Internal Server Error");
        }
    }
        async deleteTasker(req, res) {
            const taskerId = req.params.id;

            try {
                await Tasker.deleteTasker(taskerId);
                res.redirect('/admin/tasker');
            } catch (error) {
                console.error("Error deleting tasker:", error);
                res.status(500).send("Internal Server Error");
            }
        }



}

module.exports = new AdminController()
