const { SupportRequest } = require("../database/models");

class SupportRequestController {
    async create(req, res) {
        const request = { ...req.body };

        try {
            const createdRequest = await SupportRequest.create(request);

            return res.json(createdRequest);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new SupportRequestController();
