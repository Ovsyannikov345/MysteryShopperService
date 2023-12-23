const { Router } = require("express");
const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");

const router = new Router();

router.get("/users", userController.getAll);
router.get("/companies", companyController.getAll);

module.exports = router;
