const Field = require("./Field");
const { DateTimeValidator } = require("./validators");
const { ValidationError } = require("../responses/errors");
const { MaxValueValidator, MinValueValidator } = require("./validators");

module.exports = class DateTimeField extends Field {
  /**
   * This one requires careful consideration and significant modification from
   * the DRF implementation.
   * I have decided to simplify by storing all dates in UTC and converting to
   * local time client side.
   * This field will also only accept input in simplified extended ISO 8601 UTC format (YYYY-MM-DDTHH:MM:SS.sssZ)
   * as returned by the Date.toISOString() method.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   *
   * This field is designed to work with Sequelize's DATE type and MySQL DATETIME type.
   */

  static default_error_messages = {
    invalid:
      "Datetime has wrong format. ISO 8601 UTC formatted string required (YYYY-MM-DDTHH:MM:SS.mmmZ)",
    max_value: (max_value) =>
      `Ensure this date is before or equal to ${max_value.toISOString()}.`,
    min_value: (min_value) =>
      `Ensure this date is after or equal to ${min_value.toISOString()}.`,
  };

  constructor({ max_value = null, min_value = null, ...options } = {}) {
    options.error_messages = {
      ...DateTimeField.default_error_messages,
      ...options.error_messages,
    };
    super(options);

    let message;
    if (max_value !== null) {
      message = this.error_messages.max_value(max_value);
      this.validators.push(
        new MaxValueValidator({ limit_value: max_value, message })
      );
    }
    if (min_value !== null) {
      message = this.error_messages.min_value(min_value);
      this.validators.push(
        new MinValueValidator({ limit_value: min_value, message })
      );
    }
  }

  to_internal_value(data) {
    let validator = new DateTimeValidator();
    try {
      validator.validate(data);
    } catch (e) {
      if (e instanceof ValidationError) this.fail("invalid");
    }
    return new Date(data);
  }

  to_representation(value) {
    return value.toISOString();
  }
};
