const ApiError = require("./ApiError");

module.exports = class ValidationError extends ApiError {
  constructor(message) {
    super(40, message);
  }
};
