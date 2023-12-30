const { Order, Report, CompanyReview, Request, User, Company, UserReview } = require("../database/models");

class OrderController {
    async getAll(req, res) {
        try {
            const companyId = req.companyId;
            const userId = req.userId;

            if (companyId) {
                const companyOrders = await Order.findAll({ where: { CompanyId: companyId } });

                return res.json(companyOrders);
            } else if (userId) {
                const orders = await Order.findAll({
                    include: [
                        {
                            model: Company,
                            attributes: ["id", "name"],
                            include: [
                                {
                                    model: Order,
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: CompanyReview,
                                            attributes: ["grade"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });

                return res.json(orders);
            }

            return res.sendStatus(401);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.sendStatus(400);
            }

            const companyId = req.companyId;
            const userId = req.userId;

            if (companyId) {
                const order = await Order.findOne({
                    where: { id: id, CompanyId: companyId },
                    include: [
                        {
                            model: Request,
                            include: [
                                {
                                    model: User,
                                    attributes: ["id", "name", "surname", "patronymic"],
                                    include: [
                                        {
                                            model: Report,
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: UserReview,
                                                    attributes: ["id", "grade"],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            model: Report,
                            include: [
                                {
                                    model: User,
                                    attributes: ["id", "name", "surname", "patronymic"],
                                    include: [
                                        {
                                            model: Report,
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: UserReview,
                                                    attributes: ["id", "grade"],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    model: UserReview,
                                    attributes: ["id"],
                                },
                            ],
                        },
                    ],
                });

                return res.json(order);
            } else if (userId) {
                const order = await Order.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: Company,
                            attributes: ["id", "name"],
                            include: [
                                {
                                    model: Order,
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: CompanyReview,
                                            attributes: ["grade"],
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: Request, where: { UserId: userId }, required: false },
                        { model: Report, where: { UserId: userId }, required: false },
                    ],
                });

                return res.json(order);
            }

            return res.sendStatus(403);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

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

    async delete(req, res) {
        try {
            const { id } = req.params;

            const companyId = req.companyId;

            if (isNaN(id)) {
                return res.sendStatus(400);
            }

            const order = await Order.findOne({ where: { id: id } });

            if (order == null) {
                return res.sendStatus(404);
            }

            if (order.CompanyId !== companyId) {
                return res.sendStatus(403);
            }

            await Order.destroy({ where: { id: id } });

            return res.sendStatus(204);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new OrderController();
