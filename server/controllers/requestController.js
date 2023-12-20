const { Request } = require("../database/models");

class RequestController {
    async create(req, res) {
        const request = { ...req.body };

        try {
            const createdRequest = Request.create(request);

            return res.json(createdRequest);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new RequestController();
