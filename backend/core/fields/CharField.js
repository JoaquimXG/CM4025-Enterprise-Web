const Empty = require("./Empty");
const Field = require("./Field");
const {
  MaxLengthValidator,
  MinLengthValidator,
  ProhibitNullCharactersValidator,
  ProhibitSurrogateCharactersValidator,
} = require("./validators");

module.exports = class CharField extends Field {
  static defaultErrorMessages = {
    invalid: "Not a valid string.",
    blank: "This field may not be blank.",
    maxLength: (maxLength) =>
      `Ensure this field has no more than ${maxLength} characters.`,
    minLength: (minLength) =>
      `Ensure this field has at least ${minLength} characters.`,
  };
  initial = "";

  constructor({
    allowBlank = false,
    trimWhitespace = true,
    maxLength = 255, // Standard length of CharField in Sequelize
    minLength = null,
    ...options
  } = {}) {
    options.errorMessages = {
      ...CharField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);

    if (maxLength !== null) {
      this.validators.push(
        new MaxLengthValidator({ limitValue: maxLength})
      );
    }
    if (minLength !== null) {
      this.validators.push(
        new MinLengthValidator({ limitValue: minLength})
      );
    }

    this.validators.push(new ProhibitNullCharactersValidator());
    this.validators.push(new ProhibitSurrogateCharactersValidator());
  }

  runValidation(data = new Empty()) {
    if (data === "" || (this.trimWhitespace && String(data).trim() === "")) {
      if (!this.allowBlank) this.fail("blank");
      return "";
    }

    return super.runValidation(data);
  }

  toInternalValue(data) {
    // Allow string or number, converted to string
    // Don't allow booleans or other complex types due to possible ambiguity
    let type = typeof data;
    if (type === "string" || type === "number") {
      let value = String(data);
      return this.trimWhitespace ? value.trim() : value;
    }
    this.fail("invalid");
  }

  toRepresentation(value) {
    return String(value);
  }
};
