const Field = require("./Field");
const { MaxValueValidator, MinValueValidator } = require("./validators");

module.exports = class IntegerField extends Field {
  default_error_messages = {
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

  default_options = {
    ...super.default_options,
    max_value: null,
    min_value: null,
  };

  // TODO refactor to use named parameters, see: https://masteringjs.io/tutorials/fundamentals/parameters
  constructor(options = {}) {
    // Merge defaults and extract options
    options = { ...default_options, ...options };
    ({ max_value, min_value } = options);

    super(options);

    if (max_value !== null) {
      message = this.default_error_messages["max_value"](max_value);
      this.validators.push(MaxValueValidator(max_value, message));
    }
    if (min_value !== null) {
      message = this.default_error_messages["min_value"](min_value);
      this.validators.push(MinValueValidator(min_value, message));
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
    // TODO can you get away with just return value here???, I am not sure
    return parseInt(value);
  }
};
