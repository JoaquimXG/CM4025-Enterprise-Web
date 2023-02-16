const BaseValidator = require("./BaseValidator");

module.exports = class MinLengthValidator extends BaseValidator {
  message = (cleanedValue, limitValue) =>
    `Ensure this value has at minimum ${limitValue} character(s) (it has ${cleanedValue}).`;

  compare(value, limitValue) {
    return value < limitValue;
  }

  clean(value) {
    return value.length;
  }
};
