const { ApiException } = require("./ApiException");

module.exports = class BadRequestException extends ApiException {
  constructor(message) {
    super(400, message);
  }
};
