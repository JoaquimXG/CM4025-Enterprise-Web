const ApiError = require("./ApiError");

module.exports = class ConflictError extends ApiError {
  constructor(message) {
    super(409, message);
  }
};
