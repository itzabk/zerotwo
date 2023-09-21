const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} = require("../controller/categoryController/categoryController");
const {
  categoryValidate,
  updateCategoryValidate,
} = require("../middleware/JOI/indexValidate");

router.route("/").get(getAllCategories);
//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE]));

router.route("/add-category").post(categoryValidate, createCategory);
router.route("/delete-category").delete(categoryValidate, deleteCategory);
router.route("/update-category").patch(updateCategoryValidate, updateCategory);


module.exports = router;
