const Empty = require("./Empty");
const Field = require("./Field");
const {
  MaxLengthValidator,
  MinLengthValidator,
  ProhibitNullCharactersValidator,
  ProhibitSurrogateCharactersValidator,
} = require("./validators");

module.exports = class CharField extends Field {
  default_error_messages = {
    ...super.default_error_messages,
    invalid: "Not a valid string.",
    blank: "This field may not be blank.",
    max_length: (max_length) =>
      `Ensure this field has no more than ${max_length} characters.`,
    min_length: (min_length) =>
      `Ensure this field has at least ${min_length} characters.`,
  };
  initial = "";

  constructor({
    allow_blank = false,
    trim_whitespace = true,
    max_length = null,
    min_length = null,
    ...options
  } = {}) {
    super(options);
    this.error_messages = {
      ...this.default_error_messages,
      ...options.error_messages,
    };

    let message;
    if (max_length !== undefined)
      //TODO lazy format
      message = this.error_messages.max_length(max_length);
    this.validators.push(new MaxLengthValidator(max_length, message));
    if (min_length !== undefined)
      message = this.error_messages.min_length(min_length);
    this.validators.push(new MinLengthValidator(min_length, message));

    this.validators.push(new ProhibitNullCharactersValidator());
    this.validators.push(new ProhibitSurrogateCharactersValidator());
  }

  run_validation(data = new Empty()) {
    if (data === "" || (this.trim_whitespace && String(data).trim() === "")) {
      if (!this.allow_blank) this.fail("blank");
      return "";
    }

    super.run_validation(data);
  }

  to_internal_value(data) {
    // Allow string or number, converted to string
    // Don't allow booleans or other complex types due to possible ambiguity
    let type = typeof data;
    if (type === "string" || type === "number") {
      let value = String(data);
      return this.trim_whitespace ? value.trim() : value;
    }
    this.fail("invalid");
  }

  to_representation(value) {
    return String(value);
  }
};
