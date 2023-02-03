const BaseValidator = require("./BaseValidator");

module.exports = class MaxLengthValidator extends BaseValidator {
  message = (cleaned_value, limit_value) =>
    `Ensure this value has at most ${limit_value} character(s) (it has ${cleaned_value}).`;

  compare(value, limit_value) {
    // Could use short hand here: return !(value.length > limit_value);
    // But I think this is more readable
    if (value.length > limit_value) return false;
    return true;
  }
};
