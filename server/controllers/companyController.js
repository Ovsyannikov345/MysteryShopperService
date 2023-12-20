const { Company, ContactPerson, Order, CompanyReview } = require("../database/models");

class CompanyController {
    async getAll(req, res) {
        try {
            const companies = await Company.findAll({
                include: [{ model: ContactPerson }, { model: Order }, { model: CompanyReview }],
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
                include: [{ model: ContactPerson }, { model: Order }, { model: CompanyReview }],
            });

            return res.json(company);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async create(req, res) {
        const company = { ...req.body };

        try {
            const createdCompany = await Company.create(company);

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

        try {
            await Company.update(company, { where: { id: id } });

            return res.sendStatus(204);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new CompanyController();
