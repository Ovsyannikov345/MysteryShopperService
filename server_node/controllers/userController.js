const { User, Order, Report, UserReview, Company } = require("../database/models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

class UserController {
    async getOne(req, res) {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        try {
            const user = await User.findOne({
                where: { id: id },
                attributes: { exclude: ["password"] },
                include: [
                    { model: Order },
                    {
                        model: Report,
                        include: [
                            {
                                model: UserReview,
                                include: [
                                    {
                                        model: Company,
                                        attributes: ["id", "name"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (user == null) {
                return res.sendStatus(404);
            }

            return res.json(user);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async getProfile(req, res) {
        const id = req.userId;

        if (!id) {
            return res.sendStatus(403);
        }

        try {
            const user = await User.findOne({
                where: { id: id },
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: Order,
                    },
                    {
                        model: Report,
                        include: [
                            {
                                model: UserReview,
                                include: [
                                    {
                                        model: Company,
                                        attributes: ["id", "name"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            return res.json(user);
        } catch (err) {
            console.log(err);
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
                return res.sendStatus(204);
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

        if (id != req.userId) {
            return res.sendStatus(403);
        }

        const userData = { ...req.body };

        if (isNaN(id) || parseInt(id) !== userData.id) {
            return res.sendStatus(400);
        }

        const user = await User.findOne({ where: { id: id } });

        if (user == null) {
            return res.sendStatus(404);
        }

        try {
            await User.update(userData, { where: { id: id } });

            const result = await User.findOne({
                where: { id: id },
                attributes: { exclude: ["password"] },
                include: [{ model: Order }, { model: Report, include: [{ model: UserReview }] }],
            });

            return res.status(200).json(result);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async updateAvatar(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.sendStatus(400);
            }

            if (id != req.userId) {
                return res.sendStatus(403);
            }

            const savePath = path.join(__dirname, "../", "avatars", "user", id + ".png");

            const imagePath = path.join(__dirname, "../", "uploads", id + ".png");

            if (!fs.existsSync(imagePath)) {
                return res.sendStatus(404);
            }

            fs.rename(imagePath, savePath, (err) => {
                if (err) throw err;
            });

            return res.sendStatus(204);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
}

module.exports = new UserController();
