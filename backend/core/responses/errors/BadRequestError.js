const ApiError = require("./ApiError");

module.exports = class BadRequestError extends ApiError {
  constructor(message) {
    super(400, message);
  }
};
