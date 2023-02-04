const BaseValidator = require("./BaseValidator");

module.exports = class MinValueValidator extends BaseValidator {
  mesage = (cleaned_value, min_value) =>
    `Ensure this value is more than or equal to ${min_value}. (value: ${cleaned_value})`;

  compare(a, b) {
    return a < b;
  }
};
