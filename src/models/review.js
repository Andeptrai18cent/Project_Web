class Review {
    constructor(task_id, reviewee_user_id, rating, review_content) {
        this.task_id = task_id;
        this.reviewee_user_id = reviewee_user_id;
        this.rating = rating;
        this.review_content = review_content
    }
}

module.exports = Review;