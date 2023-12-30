const { Request } = require("../database/models");

class RequestController {
    async create(req, res) {
        const orderId = req.params.id;

        if (isNaN(orderId)) {
            return res.sendStatus(400);
        }

        const userId = req.userId;

        if (!userId) {
            return res.sendStatus(403);
        }

        const request = {
            UserId: userId,
            OrderId: orderId,
            accepted: false,
            rejected: false,
        };

        try {
            if ((await Request.findOne({ where: { UserId: userId, OrderId: orderId } })) != null) {
                return res.sendStatus(400);
            }

            const createdRequest = await Request.create(request);

            return res.json(createdRequest);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new RequestController();
