const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const generateAccessToken = (accessPayload) => {
  try {
    //Access Private Key
    const accessKey = fs.readFileSync(
      path.join(__dirname, "..", "keyGens", "privateACCESSKey.pem")
    );
    //Generate Access Token
    const accessToken = jwt.sign(
      accessPayload,
      { key: accessKey, passphrase: process.env.PASSPHRASE },
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
        algorithm: process.env.JWT_ALGORITHM,
      }
    );
    return accessToken;
  } catch (err) {
    console.log("utils/generateAccessToken", err.message);
  }
};

module.exports = generateAccessToken;
