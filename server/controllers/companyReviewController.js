const { CompanyReview } = require("../database/models");

class CompanyReviewController {
    async create(req, res) {
        const review = { ...req.body };

        try {
            const createdReview = CompanyReview.create(review);

            return res.json(createdReview);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyReviewController();
