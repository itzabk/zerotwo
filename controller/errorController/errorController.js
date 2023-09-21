const customError = require("../../utils/customError");
const errLogger = require("../../middleware/errLogger");
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.status).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      message: "Something went wrong! Please try again later.",
    });
  }
};

const CastErrorHandler = (error) => {
  const message = `Invalid value for ${error.path}: ${error.value}`;
  const castError = new customError(400, message);
  return castError;
};

const TypeErrorHandler = (error) => {
  const message = `Invalid Object Id or Invalid value [undefined] or [Type Conversion Failure]`;
  const typeError = new customError(400, message);
  return typeError;
};

const DuplicateKeyErrorHandler = (error) => {
  const message = `Record(s) with the entered data: ${Object.values(
    error.keyValue
  ).join(",")} already exists in the Database`;
  const duplicatekeyError = new customError(409, message);
  return duplicatekeyError;
};

const ValidationErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;
  const validationError = new customError(400, msg);
  return validationError;
};

const defaultErrorHandler = (err, req, res, next) => {
  err.status = err.status ? err.status : 500;
  err.message = err.message
    ? err.message
    : "Internal Server Error,Try again later";
  if (process.env.NODE_ENV === "dev") {
    errLogger(err, req, res, next);
    return res
      .status(err.status)
      .json({ message: err.message, name: err.name, err });
  } else if (process.env.NODE_ENV === "prod") {
    if (err.code === 11000) {
      err = DuplicateKeyErrorHandler(err);
    }
    if (err.name === "ValidationError") {
      err = ValidationErrorHandler(err);
    }
    if (err.name === "CastError") {
      err = CastErrorHandler(err);
    }
    if (err.name === "TypeError") {
      err = TypeErrorHandler(err);
    }
    prodErrors(res, err);
  }
};

module.exports = defaultErrorHandler;
