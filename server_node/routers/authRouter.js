const { Router } = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const companyController = require("../controllers/companyController");

const router = new Router();

router.post("/login", authController.login);
router.post("/register", authController.checkEmail);
router.post("/register/user", userController.create);
router.post("/register/company", companyController.create);

module.exports = router;
