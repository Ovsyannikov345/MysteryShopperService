const { Router } = require("express");
const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");
const orderController = require('../controllers/orderController');

const router = new Router();

router.get("/users", userController.getAll);
router.get("/companies", companyController.getAll);

router.post("/orders", orderController.create);

module.exports = router;
