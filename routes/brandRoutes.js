const express = require("express");
const router = express.Router();
const {
  createBrand,
  deleteBrand,
  getAllBrands,
} = require("../controller/brandController/brandController");
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const upload = require("../middleware/multerS3");
const rateLimit = require("../middleware/rateLimiter");
const { brandValidate } = require("../middleware/JOI/indexValidate");

router.route("/").get(getAllBrands);
//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE]));
router
  .route("/add-brand")
  .post(upload.single("bimg"), brandValidate, createBrand);
router.route("/delete-brand").delete(brandValidate, deleteBrand);


module.exports = router;
