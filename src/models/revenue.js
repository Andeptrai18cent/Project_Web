class Revenue {
    constructor(payment_id, task_id, tasker_id, tasker_earning, company_revenue) {
        this.payment_id = payment_id;
        this.task_id = task_id;
        this.tasker_id = tasker_id;
        this.tasker_earning = tasker_earning;
        this.company_revenue = company_revenue;
    }
}

module.exports = Revenue;
