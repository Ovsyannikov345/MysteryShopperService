const { UserReview } = require("../database/models");

class UserReviewController {
    async create(req, res) {
        const review = { ...req.body };

        try {
            const createdReview = UserReview.create(review);

            return res.json(createdReview);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new UserReviewController();
