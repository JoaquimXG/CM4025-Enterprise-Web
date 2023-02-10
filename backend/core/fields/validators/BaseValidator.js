const { ValidationError } = require("../../responses/errors");

module.exports = class BaseValidator {
  message = (cleaned_value, limit_value) =>
    `Ensure this value is ${limit_value} (it is ${cleaned_value}).`;
  code = "limit_value";

  constructor({ limit_value, message = null } = {}) {
    this.limit_value = limit_value;
    if (message !== null) this.message = message;
  }

  validate(value) {
    let cleaned = this.clean(value);
    let limit_value =
      this.limit_value instanceof Function
        ? this.limit_value()
        : this.limit_value;
    if (this.compare(cleaned, limit_value))
      throw new ValidationError(this.message(cleaned, limit_value));
  }

  // Return true for validation failure
  compare(a, b) {
    //Just a temporary implementation, to be overidden by subclasses
    return a !== b;
  }

  clean(value) {
    return value;
  }
};
