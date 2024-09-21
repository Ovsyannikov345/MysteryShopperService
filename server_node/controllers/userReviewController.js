const { UserReview } = require("../database/models");

class UserReviewController {
    async create(req, res) {
        if (!req.companyId) {
            return res.sendStatus(403);
        }

        const companyId = req.companyId;

        const review = { ...req.body, CompanyId: companyId };

        try {
            const createdReview = UserReview.create(review);

            return res.json(createdReview);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new UserReviewController();
