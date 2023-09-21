const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const upload = require("../middleware/multerS3");
const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getBPDistribution,
  getProduct,
} = require("../controller/productController/productController");
const { productValidate } = require("../middleware/JOI/indexValidate");

//global access
router.route("/").get(getProducts);
router
  .route("/distribution/")
  .get(accessAuth, authorizeRole([process.env.ADMIN_ROLE]), getBPDistribution);
router.route("/:productId").get(getProduct);

//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE]));
router
  .route("/add-product")
  .post(upload.single("pimg"), productValidate, addProduct);

router.route("/delete-product").delete(deleteProduct);
router.route("/update-product").patch(updateProduct);

module.exports = router;
