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

const router = new Router();

router.get("/users", userController.getAll);
router.get("/users/:id/avatar", userController.getAvatar);

router.get("/companies", companyController.getAll);
router.get("/company", companyController.getProfile);
router.get("/companies/:id/avatar", companyController.getAvatar);
router.post("/companies/:id/avatar", upload.single("image"), companyController.updateAvatar);
router.put("/companies/:id", companyController.update);

router.get("/company/orders", orderController.getAll);
router.post("/orders", orderController.create);
router.delete("/orders/:id", orderController.delete);

module.exports = router;
