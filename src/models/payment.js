class Payment {
    constructor(task_id, payer_user_id, payee_user_id, payment_date, total_price) {
        this.task_id = task_id;
        this.payer_user_id = payer_user_id;
        this.payee_user_id = payee_user_id;
        this.payment_date = payment_date;
        this.total_price = total_price;
    }
}

module.exports = Payment;