const { Router } = require("express");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        if (req.userId) {
            cb(null, req.userId + extension);
        } else {
            cb(null, req.companyId + extension);
        }
    },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");
const orderController = require("../controllers/orderController");
const requestController = require("../controllers/requestController");
const reportController = require("../controllers/reportController");
const userReviewController = require("../controllers/userReviewController");
const companyReviewController = require("../controllers/companyReviewController");
const supportRequestController = require("../controllers/supportRequestController");

const router = new Router();

router.get("/user", userController.getProfile);
router.get("/users/:id", userController.getOne);
router.get("/users/:id/avatar", userController.getAvatar);
router.post("/users/:id/avatar", upload.single("image"), userController.updateAvatar);
router.put("/users/:id", userController.update);

router.get("/company", companyController.getProfile);
router.get("/companies/:id", companyController.getOne);
router.get("/companies/:id/avatar", companyController.getAvatar);
router.post("/companies/:id/avatar", upload.single("image"), companyController.updateAvatar);
router.put("/companies/:id", companyController.update);

router.get("/orders", orderController.getAll);
router.get("/user/orders", orderController.getUserOrders);
router.get("/orders/:id", orderController.getOne);
router.post("/orders", orderController.create);
router.post("/orders/:id/requests", requestController.create);
router.post("/orders/:id/reports", reportController.create);
router.delete("/orders/:id", orderController.delete);

router.put("/requests/:id", requestController.update);

router.post("/user-reviews", userReviewController.create);
router.post("/company-reviews", companyReviewController.create);

router.post("/support-requests", supportRequestController.create);

module.exports = router;
