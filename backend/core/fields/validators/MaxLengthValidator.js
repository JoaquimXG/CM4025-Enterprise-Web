const BaseValidator = require("./BaseValidator");

module.exports = class MaxLengthValidator extends BaseValidator {
  compare(value, limit_value) {
    if (value.length > limit_value) return false;
    return true;
  }
};
