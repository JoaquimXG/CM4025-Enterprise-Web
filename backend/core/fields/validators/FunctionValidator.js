/**
 * This validator is designed to work with a simple function that takes a single
 * argument: value as input. The function should return true if the validation passes otherwise false.
 * It takes a function in constructor and only a single value for compare
 */

const BaseValidator = require("./BaseValidator");

module.exports = class FunctionValidator extends BaseValidator {
  constructor(validatorFunction, message) {
    this.validatorFunction = validatorFunction;
    this.message = message;
  }

  compare(value) {
    // Negating the result of validator function as function should return true if validation passes
    // while the compare function should return true if validation fails
    return !this.validatorFunction(value);
  }
};
