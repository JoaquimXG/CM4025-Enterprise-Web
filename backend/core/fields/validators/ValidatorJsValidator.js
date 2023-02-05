/**
 * This validator is designed to work with a validator function from validator.js
 * Takes a validator.js function and a message to return if the validation fails.
 * Optionally arguments can be passed on to the validator function.
 * validator.js functions take a value and optionally some options, returning true
 * if the value was valid, otherwise false.
 * This is negated.
 * This validator is useful as it allows for the same validation rules to be used
 * from sequelizer on model validation as within controllers.
 */

const BaseValidator = require("./BaseValidator");

module.exports = class ValidatorJsValidator extends BaseValidator {
  constructor(validator, message, ...args) {
    super();
    this.validator = validator;
    this.message = message;
    this.args = args;
  }

  compare(value) {
    return !this.validator(value, ...this.args);
  }
};
