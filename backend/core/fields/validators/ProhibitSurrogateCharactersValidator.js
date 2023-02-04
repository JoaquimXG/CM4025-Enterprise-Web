const { ValidationError } = require("../../responses/errors");
const BaseValidator = require("./BaseValidator");

module.exports = class ProhibitSurrogateCharactersValidator extends (
  BaseValidator
) {
  message = 'Surrogate characters are not allowed';

  validate() {
    if (this.value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g))
      throw new ValidationError(this.message());
  }
};
