const redisClient = require("../config/redisConfig");
const base64url = require("base64url");
const bcrypt = require("bcryptjs");

const verifyEmail = async (id, verifyId, append) => {
  try {
    const vid = base64url.decode(id);
    const value = await redisClient.GET(vid + append);
    if (!value) {
      return false;
    }
    const vres = await bcrypt.compare(verifyId, value);
    return vres;
  } catch (err) {
    console.log("utils/verifyEmail", err.message);
  }
};

module.exports = verifyEmail;
