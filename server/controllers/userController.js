const { User, Order, Report, UserReview } = require("../database/models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

class UserController {
    async getAll(req, res) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ["password"] },
                include: [{ model: Order }, { model: Report, include: [{ model: UserReview }] }],
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
                attributes: { exclude: ["password"] },
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

    async getAvatar(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.sendStatus(400);
            }

            const imagePath = path.join(__dirname, "../", "avatars", "user", id + ".png");

            if (!fs.existsSync(imagePath)) {
                return res.sendStatus(404);
            }

            return res.sendFile(imagePath);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }

    async create(req, res) {
        try {
            const user = { ...req.body };

            if ((await User.findOne({ where: { email: user.email } })) !== null) {
                return res.status(400).json({ error: "Email is taken" });
            }

            user.password = await bcrypt.hash(user.password, 10);

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

        if (req.userId !== id) {
            return res.sendStatus(403);
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
