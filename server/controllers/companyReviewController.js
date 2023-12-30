const { CompanyReview } = require("../database/models");

class CompanyReviewController {
    async create(req, res) {
        if (!req.userId) {
            return res.sendStatus(403);
        }

        const userId = req.userId;

        const review = { ...req.body, UserId: userId };

        try {
            const createdReview = CompanyReview.create(review);

            return res.json(createdReview);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyReviewController();
