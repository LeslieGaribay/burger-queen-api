// Error object used in error handling middleware function
class AppError extends Error{
  statusCode = undefined;

  constructor(statusCode, message) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

module.exports = AppError;