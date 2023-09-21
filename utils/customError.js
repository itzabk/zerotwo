//Create Custom Error Class
class customError extends Error {
  constructor(status = 500, message) {
    super();
    this.status = status;
    this.message = message;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = customError;
