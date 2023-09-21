const redisClient = require("../config/redisConfig");

const verifyOtp = async (email, otp) => {
  try {
    const userOTP = await redisClient.GET(email + "otp");
    if (!userOTP) {
      return false;
    }
    if (userOTP === otp) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("utils/verifyOtp", err.message);
  }
};

module.exports = verifyOtp;
