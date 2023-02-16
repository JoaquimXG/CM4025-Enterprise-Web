const BaseValidator = require("./BaseValidator");

module.exports = class MaxValueValidator extends BaseValidator {
  message = (cleanedValue, maxValue) =>
    `Ensure this value is less than or equal to ${maxValue}. (value: ${cleanedValue})`;

  compare(a, b) {
    return a > b;
  }
};
