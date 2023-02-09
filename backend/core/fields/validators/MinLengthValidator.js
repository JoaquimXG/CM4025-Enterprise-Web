const BaseValidator = require("./BaseValidator");

module.exports = class MinLengthValidator extends BaseValidator {
  message = (cleaned_value, limit_value) =>
    `Ensure this value has at minimum ${limit_value} character(s) (it has ${cleaned_value}).`;

  compare(value, limit_value) {
    return value < limit_value;
  }

  clean(value) {
    return value.length;
  }
};
