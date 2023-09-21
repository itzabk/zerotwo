const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authRole");
const accessAuth = require("../middleware/accessAuth");
const rateLimit = require("../middleware/rateLimiter");
const {
  createCart,
  emptyCart,
  getCart,
  addCartItem,
  delCartItem,
  incCartItem,
  decCartItem,
} = require("../controller/cartController/cartController");
const {
  paymentSession,
  paymentHook,
} = require("../controller/paymentController/paymentController");

//webhook endpoint
router
  .route("/stripe/payment-event-hook")
  .post(paymentHook);

//Authentication and authorization;
router.use(rateLimit);
router.use(accessAuth);
router.use(authorizeRole([process.env.ADMIN_ROLE, process.env.CUST_ROLE]));

router.route("/create-cart").post(createCart);
router.route("/empty-cart/:cartId").delete(emptyCart);
router.route("/").post(getCart);
router.route("/add-item/").patch(addCartItem);
router.route("/inc-item/").patch(incCartItem);
router.route("/dec-item/").patch(decCartItem);
router.route("/del-item/").delete(delCartItem);
router.route("/stripe/create-checkout-session/").post(paymentSession);

module.exports = router;
