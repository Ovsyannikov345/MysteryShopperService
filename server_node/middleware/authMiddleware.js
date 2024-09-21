const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    var token = req.header("Authorization");

    if (!token) {
        token = req.query.jwt;
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        req.companyId = decoded.companyId;
        next();
    } catch (error) {
        
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;
