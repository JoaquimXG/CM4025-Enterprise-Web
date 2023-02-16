const { ValidationError } = require("../../responses/errors");

module.exports = class BaseValidator {
  message = (cleanedValue, limitValue) =>
    `Ensure this value is ${limitValue} (it is ${cleanedValue}).`;
  code = "limitValue";

  constructor({ limitValue, message = null } = {}) {
    this.limitValue = limitValue;
    if (message !== null) this.message = message;
  }

  validate(value) {
    let cleaned = this.clean(value);
    let limitValue =
      this.limitValue instanceof Function
        ? this.limitValue()
        : this.limitValue;
    if (this.compare(cleaned, limitValue))
      throw new ValidationError(this.message(cleaned, limitValue));
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
