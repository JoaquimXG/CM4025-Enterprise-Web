const Empty = require("./Empty");
const Field = require("./Field");
const {
  MaxLengthValidator,
  MinLengthValidator,
  ProhibitNullCharactersValidator,
  ProhibitSurrogateCharactersValidator,
} = require("./validators");

module.exports = class CharField extends Field {
  static default_error_messages = {
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
    max_length = 255, // Standard length of CharField in Sequelize
    min_length = null,
    ...options
  } = {}) {
    options.error_messages = {
      ...CharField.default_error_messages,
      ...options.error_messages,
    };
    super(options);

    if (max_length !== null) {
      this.validators.push(
        new MaxLengthValidator({ limit_value: max_length})
      );
    }
    if (min_length !== null) {
      this.validators.push(
        new MinLengthValidator({ limit_value: min_length})
      );
    }

    this.validators.push(new ProhibitNullCharactersValidator());
    this.validators.push(new ProhibitSurrogateCharactersValidator());
  }

  run_validation(data = new Empty()) {
    if (data === "" || (this.trim_whitespace && String(data).trim() === "")) {
      if (!this.allow_blank) this.fail("blank");
      return "";
    }

    return super.run_validation(data);
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
