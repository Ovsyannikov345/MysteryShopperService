const { Router } = require("express");
const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");
const orderController = require("../controllers/orderController");

const router = new Router();

router.get("/users", userController.getAll);
router.get("/users/:id/avatar", userController.getAvatar);

router.get("/companies", companyController.getAll);
router.get("/company", companyController.getProfile);
router.get("/companies/:id/avatar", companyController.getAvatar);

router.post("/orders", orderController.create);

module.exports = router;
