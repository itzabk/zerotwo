const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const {
  getOrder,
  getOrders,
} = require("../controller/orderController/orderController");

//Limit requests from IP
router.use(rateLimit);
router.use(accessAuth);

router.route("/").get(authorizeRole([process.env.ADMIN_ROLE]), getOrders);
router
  .route("/:userId")
  .get(
    authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]),
    getOrder
  );

module.exports = router;
