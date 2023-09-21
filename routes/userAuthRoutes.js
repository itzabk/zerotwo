const {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  generateEmail,
  emailVerification,
  generateResetLink,
  resetPasswordForm,
  resetPassword,
  generateNewPassword,
  generateOTP,
} = require("../controller/userAuth/userAuth");
const {
  registerValidate,
  loginValidate,
  emailValidate,
  passwordValidate,
} = require("../middleware/JOI/indexValidate");
const limiter = require("../middleware/rateLimiter");

const express = require("express");
const router = express.Router();

router.use(limiter);
router.route("/register").post(registerValidate, registerUser);
router.route("/login").post(loginValidate, loginUser);
router.route("/refresh").get(refreshUser);
router.route("/logout").post(logoutUser);
router.route("/gen-link").post(emailValidate, generateEmail);
router.route("/verify-email/:id/:verifyId").get(emailVerification);
router.route("/pswd-reset-link").post(generateResetLink);
router
  .route("/reset-password/:uid/:linkid")
  .get(resetPasswordForm)
  .post(passwordValidate, resetPassword);
router.route("/generate-password").get(generateNewPassword);
router.route("/generate-otp").post(emailValidate, generateOTP);

module.exports = router;
