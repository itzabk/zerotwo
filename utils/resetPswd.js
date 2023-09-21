const redisClient = require("../config/redisConfig");
const bcrypt = require("bcryptjs");

const resetPasswordVerify = async (email, url, append) => {
  try {
    const result = await redisClient.GET(email + append);
    if (result) {
      const decrypted = await bcrypt.compare(url, result);
      console.log(decrypted);
      if (decrypted) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log("utils/resetPswd", err.message);
  }
};

module.exports = resetPasswordVerify;
