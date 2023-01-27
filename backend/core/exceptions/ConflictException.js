const { ApiException } = require("./ApiException");

module.exports = class ConflictException extends ApiException {
  constructor(message) {
    super(409, message);
  }
};
