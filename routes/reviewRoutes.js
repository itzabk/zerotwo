const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const { reviewValidate } = require("../middleware/JOI/indexValidate");
const {
  addReview,
  deleteReview,
} = require("../controller/reviewController/reviewController");

//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]));

router.route("/add-review").post(reviewValidate, addReview);
router.route("/delete-review").delete(deleteReview);

module.exports = router;
