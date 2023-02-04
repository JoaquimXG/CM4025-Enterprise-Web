const BaseValidator = require("./BaseValidator");

module.exports = class MaxValueValidator extends BaseValidator {
  mesage = (cleaned_value, max_value) =>
    `Ensure this value is less than or equal to ${max_value}. (value: ${cleaned_value})`;

  compare(a, b) {
    return a > b;
  }
};
