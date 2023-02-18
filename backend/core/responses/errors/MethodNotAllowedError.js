const ApiError = require("./ApiError");

module.exports = class MethodNotAllowedError extends ApiError {
  constructor(message) {
    super(405, message);
  }
};
