const customLogger = require("../utils/customLogger");
const customError = require("../utils/customError");

const reqLogger = async (req, res, next) => {
  try {
    const message = `${req.protocol}\t${req.hostname}\t${req.ip || req.ips}\t${
      req.method
    }\t${req.path}`;
    await customLogger(message, "requestLogs.log");
    next();
  } catch (err) {
    console.log(`/middleware/reqLogger`,err.message);
    next(new customError(500, "Request Logger Failure"));
  }
};

module.exports = reqLogger;
