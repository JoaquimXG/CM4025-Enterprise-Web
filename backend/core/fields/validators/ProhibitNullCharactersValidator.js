const { ValidationError } = require("../../responses/errors");
const BaseValidator = require("./BaseValidator");

module.exports = class ProhibitNullCharactersValidator extends BaseValidator {
  message = () => "Null characters are not allowed.";

  constructor({ message = null } = {}) {
    super({});
    if (message !== null) this.message = message;
  }

  validate(value) {
    if (value.includes("\0")) throw new ValidationError(this.message());
  }
};
