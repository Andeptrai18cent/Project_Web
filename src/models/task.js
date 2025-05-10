class Task {
    constructor(service_id, description, location, tasker_id, task_date, user_id, status, created_at) {
        this.service_id = service_id;
        this.description = description;
        this.location = location;
        this.tasker_id = tasker_id;
        this.task_date = task_date;
        this.user_id = user_id;
        this.status = status;
        this.created_at = created_at;
    }
}

module.exports = Task;