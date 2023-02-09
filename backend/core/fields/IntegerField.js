const Field = require("./Field");
const { MaxValueValidator, MinValueValidator } = require("./validators");

module.exports = class IntegerField extends Field {
  default_error_messages = {
    ...super.default_error_messages,
    invalid: "Must be a valid integer.",
    max_value: (max_value) =>
      `Ensure this value is less than or equal to ${max_value}.`,
    min_value: (min_value) =>
      `Ensure this value is greater than or equal to ${min_value}.`,
    max_string_length: "String value too large.",
    disallowed_decimal: "Float values are not allowed.",
  };

  MAX_STRING_LENGTH = 100; // Guard against malicious string inputs.
  // Allow 1.0 or 1.00, but not 1.2
  allowed_decimal = /\.0*\s*$/; // For removing trailing .0 from decimal strings
  disallowed_decimal = /\..*\s*$/; // For catching decimal strings after removing trailing .0


  constructor({max_value = null, min_value = null, ...options} = {}) {
    super(options);
    this.error_messages = {
      ...this.default_error_messages,
      ...options.error_messages,
    };

    let message;
    if (max_value !== null) {
      message = this.error_messages.max_value(max_value);
      this.validators.push(new MaxValueValidator(max_value, message));
    }
    if (min_value !== null) {
      message = this.error_messages.min_value(min_value);
      this.validators.push(new MinValueValidator(min_value, message));
    }
  }

  to_internal_value(data) {
    if (typeof data === "string") {
      if (data.length > this.MAX_STRING_LENGTH) this.fail("max_string_length");
    }

    // ParseInt first converts to string so may as well do so here
    data = String(data);
    if (data.match(this.allowed_decimal))
      data = data.replace(this.re_decimal, "");

    if (data.match(this.disallowed_decimal)) this.fail("disallowed_decimal");

    data = parseInt(data, 10);
    if (isNaN(data)) this.fail("invalid");

    return data;
  }

  to_representation(value) {
    return parseInt(value);
  }
};
