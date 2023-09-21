const customLogger = require("../utils/customLogger");
const customError = require("../utils/customError");

const mongoErrLogger = async (err) => {
  try {
    const message = `${err?.name}\t${err?.message}\t${err.code}`;
    await customLogger(message, "mongoLogs.log");
  } catch (err) {
    console.log(`/middleware/mongoErrLogger`,err.message);
  }
};

module.exports = mongoErrLogger;
