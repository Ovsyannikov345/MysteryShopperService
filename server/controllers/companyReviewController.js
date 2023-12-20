const { CompanyReview } = require("../database/models");

class CompanyReviewController {
    async create(req, res) {
        const review = { ...req.body };

        if (!req.userId || review.UserId !== req.userId) {
            return res.sendStatus(403);
        }

        try {
            const createdReview = CompanyReview.create(review);

            return res.json(createdReview);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyReviewController();
