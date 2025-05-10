class Tasker {
    constructor(tasker_id, user_id, bio , hourly_rate, actual_income, service_group_id) {
        this.tasker_id = tasker_id;
        this.user_id = user_id;
        this.bio = bio;
        this.hourly_rate = hourly_rate;
        this.actual_income = actual_income;
        this.service_group_id = service_group_id;
    }
}

module.exports = Tasker;