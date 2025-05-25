class Payment {
    constructor(task_id, payer_user_id, payee_user_id, payment_date) {
        this.task_id = task_id;
        this.payer_user_id = payer_user_id;
        this.payee_user_id = payee_user_id;
        this.payment_date = payment_date;
    }
}

module.exports = Payment;