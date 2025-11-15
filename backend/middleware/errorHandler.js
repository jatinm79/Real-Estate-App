const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("Error:", err);

  if (err.code === "23505") {
    const message = "Duplicate field value entered";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "23503") {
    const message = "Referenced resource not found";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "23502") {
    const message = "Required field missing";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    error = {
      message: "File too large. Maximum size is 5MB",
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    error = {
      message: "Too many files. Maximum is 10 images",
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error = {
      message: "Unexpected field in file upload",
      statusCode: 400,
    };
  }

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
