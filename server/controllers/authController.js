const { User, Company } = require("../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email: email } });
            const company = await Company.findOne({ where: { email: email } });

            if (!user && !company) {
                return res.status(401).json({ error: "Authentication failed" });
            }

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: "Authentication failed" });
                }

                const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });

                res.status(200).json({ token: token, role: "user" });
            } else {
                const passwordMatch = await bcrypt.compare(password, company.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: "Authentication failed" });
                }

                const token = jwt.sign({ companyId: company.id }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });

                res.status(200).json({ token: token, role: "company" });
            }
        } catch (error) {
            res.status(500).json({ error: "Login failed" });
        }
    }

    async checkEmail(req, res) {
        try {
            const { email } = { ...req.body };

            const user = await User.findOne({ where: { email: email } });
            const company = await Company.findOne({ where: { email: email } });

            if (!user && !company) {
                return res.status(200).json({ available: true });
            }

            return res.status(200).json({ available: false });
        } catch (error) {
            res.status(500).json({ error: "Email check failed" });
        }
    }
}

module.exports = new AuthController();
