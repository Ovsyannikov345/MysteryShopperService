const { SupportRequest } = require("../database/models");

class SupportRequestController {
    async create(req, res) {
        try {
            const userId = req.userId;
            const companyId = req.companyId;

            if (userId) {
                const request = {
                    ...req.body,
                    UserId: userId,
                };

                const createdRequest = await SupportRequest.create(request);

                return res.json(createdRequest);
            } else if (companyId) {
                const request = {
                    ...req.body,
                    CompanyId: companyId,
                };

                const createdRequest = await SupportRequest.create(request);

                return res.json(createdRequest);
            }

            return res.sendStatus(401);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
}

module.exports = new SupportRequestController();
