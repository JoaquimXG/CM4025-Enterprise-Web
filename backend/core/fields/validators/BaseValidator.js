module.exports = class BaseValidator {
  constructor(value, limit_value, message, code) {
    this.value = value;
    this.limit_value = limit_value;
    this.message = message;
    this.code = code;
  }

  compare(value, limit_value) {
    throw new Error("Not implemented");
  }

  clean(value) {
    if (this.compare(value, this.limit_value)) {
      return value;
    }
    throw new Error(this.message);
  }
};
