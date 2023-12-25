const { Company, ContactPerson, Order, CompanyReview, User } = require("../database/models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

class CompanyController {
    async getAll(req, res) {
        try {
            const companies = await Company.findAll({
                attributes: { exclude: ["password"] },
                include: [
                    { model: ContactPerson },
                    {
                        model: Order,
                        include: [
                            {
                                model: CompanyReview,
                                include: [{ model: User, attributes: ["id", "name", "surname"] }],
                            },
                        ],
                    },
                ],
            });

            return res.json(companies);
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
            const company = await Company.findOne({
                where: { id: id },
                attributes: { exclude: ["password"] },
                include: [
                    { model: ContactPerson },
                    {
                        model: Order,
                        include: [
                            {
                                model: CompanyReview,
                                include: [{ model: User, attributes: ["id", "name", "surname"] }],
                            },
                        ],
                    },
                ],
            });

            return res.json(company);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async getProfile(req, res) {
        const id = req.companyId;

        try {
            const company = await Company.findOne({
                where: { id: id },
                attributes: { exclude: ["password"] },
                include: [
                    { model: ContactPerson },
                    {
                        model: Order,
                        include: [
                            {
                                model: CompanyReview,
                                include: [{ model: User, attributes: ["id", "name", "surname"] }],
                            },
                        ],
                    },
                ],
            });

            return res.json(company);
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

            const imagePath = path.join(__dirname, "../", "avatars", "company", id + ".png");

            if (!fs.existsSync(imagePath)) {
                return res.sendStatus(404);
            }

            return res.sendFile(imagePath);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async create(req, res) {
        try {
            const company = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            };

            const contactPerson = { ...req.body.contactPersonInfo };

            if ((await Company.findOne({ where: { email: company.email } })) !== null) {
                return res.status(400).json({ error: "Email is taken" });
            }

            company.password = await bcrypt.hash(company.password, 10);

            const createdCompany = await Company.create({
                ...company,
            });

            const createdContactPerson = await ContactPerson.create(contactPerson);

            await createdContactPerson.setCompany(createdCompany.id);

            return res.status(201).json(createdCompany);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (id != req.companyId) {
                return res.sendStatus(403);
            }

            const companyData = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            };

            const contactPersonData = { ...req.body.contactPersonInfo };
            
            if (isNaN(id) || parseInt(id) != companyData.id) {
                return res.sendStatus(400);
            }

            const company = await Company.findOne({ where: { id: id } });

            if (company == null) {
                return res.sendStatus(404);
            }
        
            await Company.update(companyData, { where: { id: id } });
            await ContactPerson.update(contactPersonData, {where: {CompanyId: company.id}});

            return res.sendStatus(204);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyController();
