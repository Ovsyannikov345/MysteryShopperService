const { Router } = require("express");
const authRouter = require("./authRouter");
const protectedRouter = require("./protectedRouter");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.use("/auth", authRouter);
router.use("/api", authMiddleware, protectedRouter);

module.exports = router;
