const Field = require("./Field");
const { MaxValueValidator, MinValueValidator } = require("./validators");

module.exports = class IntegerField extends Field {
  static defaultErrorMessages = {
    invalid: "Must be a valid integer.",
    maxValue: (maxValue) =>
      `Ensure this value is less than or equal to ${maxValue}.`,
    minValue: (minValue) =>
      `Ensure this value is greater than or equal to ${minValue}.`,
    maxStringLength: "String value too large.",
    disallowedDecimal: "Float values are not allowed.",
  };

  MAX_STRING_LENGTH = 100; // Guard against malicious string inputs.
  // Allow 1.0 or 1.00, but not 1.2
  allowedDecimal = /\.0*\s*$/; // For removing trailing .0 from decimal strings
  disallowedDecimal = /\..*\s*$/; // For catching decimal strings after removing trailing .0

  constructor({
    maxValue = 2147483647, // 2^31 - 1, Max value of a 32-bit signed integer for MySQL
    minValue = -2147483648, // -2^31, Min value of a 32-bit signed integer for MySQL
    ...options
  } = {}) {
    options.errorMessages = {
      ...IntegerField.defaultErrorMessages,
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
    if (typeof data === "string") {
      if (data.length > this.MAX_STRING_LENGTH) this.fail("maxStringLength");
    }

    // ParseInt first converts to string so may as well do so here
    data = String(data);
    if (data.match(this.allowedDecimal))
      data = data.replace(this.reDecimal, "");

    if (data.match(this.disallowedDecimal)) this.fail("disallowedDecimal");

    data = parseInt(data, 10);
    if (isNaN(data)) this.fail("invalid");

    return data;
  }

  toRepresentation(value) {
    return parseInt(value);
  }
};
