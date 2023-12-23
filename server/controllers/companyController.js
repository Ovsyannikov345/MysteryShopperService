const { Company, ContactPerson, Order, CompanyReview } = require("../database/models");
const bcrypt = require("bcrypt");

class CompanyController {
    async getAll(req, res) {
        try {
            const companies = await Company.findAll({
                attributes: { exclude: ["password"] },
                include: [{ model: ContactPerson }, { model: Order, include: [{ model: CompanyReview }] }],
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
                include: [{ model: ContactPerson }, { model: Order }, { model: CompanyReview }],
            });

            return res.json(company);
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

            const createdCompany = await Company.create(
                {
                    ...company,
                },
            );

            const createdContactPerson = await ContactPerson.create(contactPerson);

            createdContactPerson.setCompany(createdCompany.id);

            return res.status(201).json(createdCompany);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async update(req, res) {
        const { id } = req.params;

        const company = { ...req.body };

        if (isNaN(id) || parseInt(id) !== company.id) {
            return res.sendStatus(400);
        }

        if ((await Company.findOne({ where: { id: id } })) == null) {
            return res.sendStatus(404);
        }

        if (id !== req.companyId) {
            return res.sendStatus(403);
        }

        try {
            await Company.update(company, { where: { id: id } });

            return res.sendStatus(204);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyController();
