const redisClient = require("../config/redisConfig");

const generateOtp = async (mailId) => {
  try {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    if (!(await redisClient.GET(mailId + "otp"))) {
      await redisClient.SETEX(mailId + "otp", process.env.OTP_TIME, otp);
      return otp;
    } else {
      return false;
    }
  } catch (error) {
    console.log("utils/generateOtp", error.message);
  }
};

module.exports = generateOtp;
