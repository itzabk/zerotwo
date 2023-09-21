const redisClient = require("../config/redisConfig");
const linkType = require("./genLinkType");

const generateLink = async (label, type, append) => {
  try {
    //Generate Link based on label [email] ,type [password or email], append [custom unique id]
    const { hashedLink, finalUrl } = await linkType(label, type);
    if (!(await redisClient.GET(label + append))) {
      const value = await redisClient.SETEX(
        label + append,
        process.env.LINK_TIME,
        hashedLink
      );
      return finalUrl;
    } else {
      return false;
    }
  } catch (err) {
    console.log("utils/generateEmailVerificationLink", err.message);
  }
};

module.exports = generateLink;
