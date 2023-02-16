const CharField = require("./CharField");
const { EmailValidator } = require("./validators");

module.exports = class EmailField extends CharField {
  static defaultErrorMessages = {
    invalid: () => "Enter a valid email address.",
  };

  constructor(options) {
    options.errorMessages = {
      ...EmailField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);
    let message = this.errorMessages["invalid"];
    let validator = new EmailValidator({ message });
    this.validators.push(validator);
  }
}
