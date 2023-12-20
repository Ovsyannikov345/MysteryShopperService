const { User, Order, UserReview } = require("../database/models");

class UserController {
    async getAll(req, res) {
        try {
            const users = await User.findAll({
                include: [{ model: Order }, { model: UserReview }],
            });

            return res.json(users);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async getOne(req, res) {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        try {
            const user = await User.findOne({
                where: { id: id },
                include: [{ model: Order }, { model: UserReview }],
            });

            if (user == null) {
                return res.sendStatus(404);
            }

            return res.json(user);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async create(req, res) {
        try {
            const user = { ...req.body };

            const createdUser = await User.create(user);

            return res.status(201).json(createdUser);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async update(req, res) {
        const { id } = req.params;

        const user = { ...req.body };

        if (isNaN(id) || parseInt(id) !== user.id) {
            return res.sendStatus(400);
        }

        if ((await User.findOne({ where: { id: id } })) == null) {
            return res.sendStatus(404);
        }

        try {
            await User.update(user, { where: { id: id } });

            return res.sendStatus(204);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    //TODO add order.
}

module.exports = new UserController();
