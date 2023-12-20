const { Report } = require("../database/models");

class ReportController {
    async create(req, res) {
        const report = { ...req.body };

        try {
            const createdReport = Report.create(report);

            return res.json(createdReport);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new ReportController();
