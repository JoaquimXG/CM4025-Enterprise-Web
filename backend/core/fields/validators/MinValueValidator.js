const BaseValidator = require("./BaseValidator");

module.exports = class MinValueValidator extends BaseValidator {
  message = (cleanedValue, minValue) =>
    `Ensure this value is more than or equal to ${minValue}. (value: ${cleanedValue})`;

  compare(a, b) {
    return a < b;
  }
};
