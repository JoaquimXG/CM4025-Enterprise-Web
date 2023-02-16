const BaseValidator = require("./BaseValidator");

module.exports = class MaxLengthValidator extends BaseValidator {
  message = (cleanedValue, limitValue) =>
    `Ensure this value has at most ${limitValue} character(s) (it has ${cleanedValue}).`;

  compare(value, limitValue) {
    return value > limitValue;
  }

  clean(value) {
    return value.length;
  }
};
