const ApiError = require("./ApiError");

module.exports = class ValidationError extends ApiError {
  constructor(message) {
    if (!message) message = "Validation Error";
    if (typeof message === "string") message = { message: message };
    super(400, message);
  }
};
