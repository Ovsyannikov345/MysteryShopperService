const { Order, Report, CompanyReview, Request } = require("../database/models");

class OrderController {
    async get(req, res) {}

    async create(req, res) {
        try {
            const order = { ...req.body };

            const companyId = req.companyId;

            const createdOrder = await Order.create(order);

            await createdOrder.setCompany(companyId);

            return res.status(201).json(createdOrder);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new OrderController();
