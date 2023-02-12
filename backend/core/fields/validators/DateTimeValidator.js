const { ValidationError } = require("../../responses/errors");
const BaseValidator = require("./BaseValidator");

module.exports = class DateTimeValidator extends BaseValidator {
  message =
    "Datetime has wrong format. ISO 8601 UTC formatted string required (YYYY-MM-DDTHH:MM:SS.mmmZ)";

  ISO_8601_REGEX =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3})?Z$/;

  validate(value) {
    if (typeof value !== "string") throw new ValidationError(this.message);
    if (!value.match(this.ISO_8601_REGEX))
      throw new ValidationError(this.message);
  }

  compare(a, b) {
    return a > b;
  }
};
