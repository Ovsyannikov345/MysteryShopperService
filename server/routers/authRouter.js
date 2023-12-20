const { Router } = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyController = require("../controllers/companyController");

const router = new Router();

router.post("/user/register", userController.create);
router.post("/company/register", companyController.create);
router.post("/login", authController.login);

module.exports = router;
