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

  static defaultErrorMessages = {
    invalid:
      "Datetime has wrong format. ISO 8601 UTC formatted string required (YYYY-MM-DDTHH:MM:SS.mmmZ)",
    maxValue: (maxValue) =>
      `Ensure this date is before or equal to ${maxValue.toISOString()}.`,
    minValue: (minValue) =>
      `Ensure this date is after or equal to ${minValue.toISOString()}.`,
  };

  constructor({ maxValue = null, minValue = null, ...options } = {}) {
    options.errorMessages = {
      ...DateTimeField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);

    let message;
    if (maxValue !== null) {
      message = this.errorMessages.maxValue(maxValue);
      this.validators.push(
        new MaxValueValidator({ limitValue: maxValue, message })
      );
    }
    if (minValue !== null) {
      message = this.errorMessages.minValue(minValue);
      this.validators.push(
        new MinValueValidator({ limitValue: minValue, message })
      );
    }
  }

  toInternalValue(data) {
    let validator = new DateTimeValidator();
    try {
      validator.validate(data);
    } catch (e) {
      if (e instanceof ValidationError) this.fail("invalid");
    }
    return new Date(data);
  }

  toRepresentation(value) {
    return value.toISOString();
  }
};
