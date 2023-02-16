const ApiError = require("./ApiError");

module.exports = class ForbiddenError extends ApiError {
  constructor(message) {
    super(403, message);
  }
};
