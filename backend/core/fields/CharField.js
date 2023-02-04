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
    invalid: "Not a valid string.",
    blank: "This field may not be blank.",
    max_length: (max_length) =>
      `Ensure this field has no more than ${max_length} characters.`,
    min_length: (min_length) =>
      `Ensure this field has at least ${min_length} characters.`,
  };
  initial = "";

  default_options = {
    ...super.default_options,
    allow_blank: false,
    trim_whitespace: true,
    max_length: null,
    min_length: null,
  };

  constructor(options = {}) {
    // Merge defaults and extract options
    options = { ...default_options, ...options };
    ({ allow_blank, trim_whitespace, max_length, min_length, ...options } =
      options);

    if (max_length !== undefined)
      //TODO lazy format
      message = this.default_error_messages.max_length(max_length);
    this.validators.push(MaxLengthValidator(max_length, message));
    if (min_length !== undefined)
      message = this.default_error_messages.min_length(min_length);
    this.validators.push(MinLengthValidator(min_length, message));

    this.validators.push(ProhibitNullCharactersValidator());
    this.validators.push(ProhibitSurrogateCharactersValidator());

    super(options);
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
    type = typeof data;
    if (type === "string" || type === "number") {
      value = String(data);
      return this.trim_whitespace ? value.trim() : value;
    }
    self.fail("invalid");
  }

  to_representation(value) {
    return String(value);
  }
};
