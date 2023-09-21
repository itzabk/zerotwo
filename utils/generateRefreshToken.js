const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const generateRefreshToken = (refreshPayload) => {
  try {
    //Refresh Private Key
    const refreshKey = fs.readFileSync(
      path.join(__dirname, "..", "keyGens", "privateREFRESHKey.pem")
    );
    //Generate Refresh Token
    const refreshToken = jwt.sign(
      refreshPayload,
      { key: refreshKey, passphrase: process.env.PASSPHRASE },
      {
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
        algorithm: process.env.JWT_ALGORITHM,
      }
    );
    return refreshToken;
  } catch (err) {
    console.log("utils/generateRefreshToken", err.message);
  }
};

module.exports = generateRefreshToken;
