//require Models
const User = require("../../model/User");
const Verify = require("../../model/UserVerification");
//require Modules
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const base64url = require("base64url");
const { format } = require("date-fns");
const bcrypt = require("bcryptjs");
const axios = require("axios");
//require Custom Modules
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const generateAccessToken = require("../../utils/generateAccessToken");
const generateRefreshToken = require("../../utils/generateRefreshToken");
const generateAccessPayload = require("../../config/accessPayload");
const generateRefreshPayload = require("../../config/refreshPayload");
const sendVerificationLink = require("../../utils/sendVerificationLink");
const generateEmailVerificationLink = require("../../utils/generateEmailVerificationLink");
const generateStrongPassword = require("../../utils/generateStrongPassword");
const verifyOtp = require("../../utils/verifyOtp");
const generateOtp = require("../../utils/generateOtp");
const verifyEmail = require("../../utils/verifyEmail");
const resetPasswordVerify = require("../../utils/resetPswd");
const htmlEmailMessage = require("../../public/verifyEmailTemplate");
const htmlPasswordMessage = require("../../public/verifyPasswordTemplate");
const welcomeMessage = require("../../public/registerUserTemplate");
const otpMessage = require("../../public/verifyOtpTemplate");
const signinNotificationMessage = require("../../public/signinNotificationTemplate");
const resetMessage = require("../../public/resetPasswordTemplate");
const findUserAndVerify = require("../../utils/mongoFindAndVerifyUser");

// @desc Register
// @route POST /users/register
// @access Public
const registerUser = asyncErrorHandler(async (req, res) => {
  const { name, email, phone, password, gender, token } = req.body;
  const foundUser = await User.findOne({ email }, { password: 0 })
    .lean()
    .exec();
  if (foundUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  const vUser = await Verify.findOne({ email });
  if (!vUser) {
    return res.status(400).json({ message: "User Verfication Failed" });
  }
  const createUser = await User.create({
    name,
    email,
    phone,
    password,
    gender,
    role: [process.env.CUST_ROLE],
  });
  if (!createUser) {
    return res.status(400).json({ message: "User Creation Failure" });
  }
  const done = await sendVerificationLink(
    email,
    name,
    welcomeMessage,
    "New User Registration",
    "Login to view amazing deals"
  );
  if (!done) {
    return res.status(400).json("Unknown Error Occured");
  }
  //verify Captcha
  const captchaVerify = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`
  );
  if (captchaVerify.data.success) {
    return res.status(201).json({ message: "User created successfully!" });
  } else {
    return res.status(401).json({ message: "Account creation failed" });
  }
});

// @desc Login
// @route POST /users/login
// @access Public
const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password, otp, token, lld } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(404).json({ message: "User is not found" });
  }
  const vUser = await Verify.findOne({ email });
  if (!vUser) {
    return res
      .status(401)
      .json({ message: "Unauthorized, you will be reported" });
  }
  //check if user is banned
  if (foundUser.underBan) {
    return res.status(401).json({ message: "Banned User" });
  }
  //verify otp
  const vOtp = await verifyOtp(foundUser.email, otp);
  if (!vOtp) {
    return res
      .status(400)
      .json({ message: "Invalid OTP or OTP Expired, Please try again" });
  }

  //verify Captcha
  const captchaVerify = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`
  );
  if (!captchaVerify.data.success) {
    return res.status(400).json({ message: "Captcha Verification Failed" });
  }
  if (await foundUser.isVerified(email, password)) {
    //Generate Access & Refresh Payload
    const accessPayload = generateAccessPayload(foundUser);
    const refreshPayload = generateRefreshPayload(foundUser);
    //Generate Access & Refresh Token
    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload);

    //send Sign-In notification mail
    const verifyObj = {
      mail: foundUser.email,
      time: format(new Date(), "yyyy-LLL-dd\tpp"),
      ip_address: req.ip,
      origin_address: req.get("User-Agent"),
    };
    const done = await sendVerificationLink(
      foundUser.email,
      verifyObj,
      signinNotificationMessage,
      "Verify Login",
      "check whether it was you who logged in now."
    );
    if (!done) {
      return res.status(400).json({ message: "Bad Request" });
    }
    //Send httpOnly Cookie
    res.cookie("jwToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    //update last login
    await User.updateOne({ _id: foundUser._id }, { $set: { lastlogin: lld } });
    //send Access-token
    return res.status(200).json({ accessToken });
  } else {
    return res.status(401).json({ message: "Login Failed" });
  }
});

// @desc Generate new Access token
// @route GET /users/refresh
// @access Public
const refreshUser = asyncErrorHandler(async (req, res) => {
  const { jwToken } = req?.cookies;
  if (!jwToken) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  //Public Refersh Key
  const refreshKey = fs.readFileSync(
    path.join(__dirname, "..", "..", "keyGens", "publicREFRESHkey.pem")
  );
  //Verify Refresh Key
  jwt.verify(
    jwToken,
    refreshKey,
    { algorithms: process.env.JWT_ALGORITHM },
    async (err, decoded) => {
      if (err) {
        return res.status(204).json({ message: "JWT expired" });
      }
      const foundUser = await User.findOne(
        { email: decoded.userInfo.email },
        { password: 0 }
      )
        .lean()
        .exec();
      //Generate Access Payload
      const accessPayload = generateAccessPayload(foundUser);
      //Generate Access Token
      const accessToken = generateAccessToken(accessPayload);
      return res.send({ accessToken });
    }
  );
});

// @desc Logout
// @route POST /users/logout
// @access Public
const logoutUser = asyncErrorHandler(async (req, res) => {
  const { jwToken } = req?.cookies;
  if (!jwToken) {
    return res.status(204).json({ message: "No Content/Logout" });
  }
  //Clear Cookie
  res.clearCookie("jwToken", {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.status(200).json({ message: "Logged Out Successfully" });
});

//@desc Generate Email Verification Link
//@route POST /users/gen-link
//@access Public-Private
const generateEmail = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const link = await generateEmailVerificationLink(email, "eVerify", "emil");
  if (!link) {
    return res
      .status(400)
      .json({ message: "Verification Link has been already sent" });
  }
  const sentVLink = await sendVerificationLink(
    email,
    link,
    htmlEmailMessage,
    "Email Verification Request",
    "Verify your e-mail"
  );
  if (!sentVLink) {
    return res.status(400).json("Unknown Error Occured");
  }
  return res
    .status(200)
    .json({ message: "Verification Link sent successfully" });
});

//@desc Verify Email
//@route GET /users/verify-email/:id/:verifyId
//@access Private
const emailVerification = asyncErrorHandler(async (req, res) => {
  const { id, verifyId } = req.params;
  const eid = base64url.decode(id);
  const found = await Verify.findOne({ email: eid });
  if (found) {
    return res.status(200).json({ message: "Email already Verified" });
  }
  const isVerified = await verifyEmail(id, verifyId, "emil");
  if (!isVerified) {
    return res.status(400).json({ message: "Email Verification Failed" });
  }
  const result = await Verify.create({ email: eid, eVerify: true });
  if (!result) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Email Successfully Verified" });
});

//@desc Generate Reset Password Link
//@route POST /users/pswd-reset-link
//@access Public-Private
const generateResetLink = asyncErrorHandler(async (req, res) => {
  const { email, token } = req.body;
  const foundUser = await findUserAndVerify(email);
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  //verify Captcha
  const captchaVerify = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`
  );
  if (!captchaVerify.data.success) {
    return res.status(400).json({ message: "Captcha Verification Failed" });
  }
  const link = await generateEmailVerificationLink(
    foundUser.email,
    "chPswd",
    "pswd"
  );
  if (!link) {
    return res
      .status(400)
      .json({ message: "Password Reset Link has been already sent" });
  }
  const sentVLink = await sendVerificationLink(
    email,
    link,
    htmlPasswordMessage,
    "Password Reset Request",
    "Reset your Password"
  );
  if (!sentVLink) {
    return res.status(400).json("Email not sent due to Unknown reasons");
  }
  return res
    .status(200)
    .json({ message: "Password Reset Link sent successfully" });
});

//@desc Reset Password Link [Send form back]
//@route GET /users/reset-password/:uid/:linkid
//@access Private
const resetPasswordForm = asyncErrorHandler(async (req, res) => {
  const { uid, linkid } = req.params;
  const email = base64url.decode(uid);
  const vPswd = await resetPasswordVerify(email, linkid, "pswd");
  if (!vPswd) {
    return res.status(400).json({ message: "Password Link has Expired" });
  }
  if (vPswd) {
    return res.sendFile(
      path.join(__dirname, "..", "..", "public", "resetPassword.html")
    );
  }
});

//@desc Reset Password Link [Verify form]
//@route POST /users/reset-password/:uid/:linkid
//@access Private
const resetPassword = asyncErrorHandler(async (req, res) => {
  const { uid, linkid } = req.params;
  const { password } = req.body;
  const email = base64url.decode(uid);
  const vPswd = await resetPasswordVerify(email, linkid, "pswd");
  if (!vPswd) {
    return res.status(400).json({ message: "Password Link has Expired" });
  }
  if (vPswd) {
    const hashedPswd = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPswd } },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }
    const sentVLink = await sendVerificationLink(
      email,
      null,
      resetMessage,
      "Password Updated Successfully",
      "report if you did'nt update password"
    );
    if (!sentVLink) {
      return res
        .status(400)
        .json({ message: "Unknow error occured while emailing client" });
    }
    return res.status(200).json({ message: "Password Updated Successfully" });
  }
});

//@desc Create Strong Password
//@route GET /users/generate-password
//@access Public
const generateNewPassword = (req, res) => {
  const strongPassword = generateStrongPassword();
  res.status(200).json({ newPassword: strongPassword });
};

//@desc Generate OTP
//@route POST /users/generate-otp
//@access Public-Private
const generateOTP = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const foundUser = await findUserAndVerify(email);
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access, not allowed" });
  }
  //console.log(foundUser)
  const otp = await generateOtp(foundUser.email);
  if (!otp) {
    return res
      .status(400)
      .json({ message: "Otp already sent to registered e-mail address" });
  }
  const sentOTP = await sendVerificationLink(
    foundUser.email,
    otp,
    otpMessage,
    "OTP for Login",
    "enter this OTP to Login"
  );
  if (!sentOTP) {
    res.status(400).json({ message: "Otp not sent due to unknown reasons" });
  }
  return res.status(200).json({ message: "OTP sent successfully" });
});

module.exports = {
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
};
