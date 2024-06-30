const AppError = require("../utils/appError");

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const value = err.keyValue.name;
  const message = `Duplicate field value: "${value}". Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = function () {
  return new AppError("Invalid token. Please log in again.", 401);
};

const handleJWTExpiredError = function () {
  return new AppError("Your token has expired. Please log in again.", 401);
};

const sendErrorDev = function (err, req, res) {
  console.log({ err });
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: err.message,
  });
};

const sendErrorProd = function (err, req, res) {
  // a) For API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: Send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: do NOT leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2)Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // ////////////////////////////////////////////////////////////////
  // b) For RENDERED WEBSITE
  // Operational, trusted error: Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went very wrong!",
      msg: err.message,
    });
  }

  // Programming or other unknown error: do NOT leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2)Send generic message
  return res.status(500).render("error", {
    title: "Something went very wrong!",
    msg: "Please try again later.",
  });
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // 👇 NOT working as expected (probably due to shallow copy of object)
    // let error = { ...err };

    // 👇 A work-around for the above problem
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    console.log({ err, error });
    sendErrorProd(error, req, res);
  }
};
