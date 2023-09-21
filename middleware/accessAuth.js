const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const accessAuth = (req, res, next) => {
  try {
    const accessToken =
      req?.headers?.Authorization || req?.headers?.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    if (!accessToken.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const publicAccessKey = fs.readFileSync(
      path.join(__dirname, "..", "keyGens", "publicACCESSkey.pem")
    );
    const accessKey = accessToken.split(" ")[1];
    jwt.verify(
      accessKey,
      publicAccessKey,
      {
        algorithms: process.env.JWT_ALGORITHM,
      },
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ status: "403", message: "Forbidden" });
        }
        console.log("JWT Authentication successful");
        req.name = decoded.userInfo.name;
        req.email = decoded.userInfo.email;
        req.role = decoded.userInfo.role;
        next();
      }
    );
  } catch (error) {
    console.log("/middleware/accessAuth", error.message);
  }
};

module.exports = accessAuth;
