const ApiError = require("./ApiError");

module.exports = class UnauthorizedError extends ApiError {
  constructor(message) {
    super(401, message);
  }
};
