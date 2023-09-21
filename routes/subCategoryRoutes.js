const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const {
  createSubCategory,
  deleteSubCategory,
  getASubCategory,
  updateSubCategory,
  getAllSubcategories,
} = require("../controller/subCategoryController/subCategoryController");
const {
  subCategoryValidate,
  updateSubcategoryValidate,
} = require("../middleware/JOI/indexValidate");

//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE]));

router.route("/add-subcategory").post(subCategoryValidate, createSubCategory);
router.route("/delete-subcategory").delete(deleteSubCategory);
router
  .route("/update-subcategory")
  .patch(updateSubcategoryValidate, updateSubCategory);
router.route("/").post(getASubCategory);
router.route("/all-sub").get(getAllSubcategories);

module.exports = router;
