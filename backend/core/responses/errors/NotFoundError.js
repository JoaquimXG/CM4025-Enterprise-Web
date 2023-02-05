const ApiError = require("./ApiError");

module.exports = class NotFoundError extends ApiError {
  constructor(message) {
    if (!message) {
      message = "Not Found";
    }
    super(404, message);
  }
};
