const { Report } = require("../database/models");

class ReportController {
    async create(req, res) {
        const orderId = req.params.id;

        if (isNaN(orderId)) {
            return res.sendStatus(400);
        }

        const userId = req.userId;

        if (!userId) {
            return res.sendStatus(403);
        }

        const report = {
            ...req.body,
            UserId: userId,
            OrderId: orderId,
        };

        try {
            if ((await Report.findOne({ where: { UserId: userId, OrderId: orderId } })) != null) {
                return res.sendStatus(400);
            }

            const createdReport = await Report.create(report);

            return res.json(createdReport);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new ReportController();
