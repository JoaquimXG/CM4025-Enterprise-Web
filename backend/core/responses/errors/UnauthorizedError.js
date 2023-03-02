const ApiError = require("./ApiError");

module.exports = class UnauthorizedError extends ApiError {
  constructor(message) {
    if (!message) message = "Unauthorized";
    super(401, message);
  }
};
