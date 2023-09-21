const customLogger = require("../utils/customLogger");
const customError = require("../utils/customError");

const errLogger = async (err, req, res, next) => {
  try {
    const message = `${req.protocol}\t${req.hostname}\t${req.ip || req.ips}\t${
      req.method
    }\t${req.path}\t${err?.name}\t${err?.status}\t${err?.message}`;
    await customLogger(message, "errorLogs.log");
  } catch (err) {
    console.log("/middleware/errLogger", err.message);
    next(new customError(500, "Error Logger Failure"));
  }
};

module.exports = errLogger;
