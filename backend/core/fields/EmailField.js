const CharField = require("./CharField");
const { EmailValidator } = require("./validators");

module.exports = class EmailField extends CharField {
  static default_error_messages = {
    invalid: () => "Enter a valid email address.",
  };

  constructor(options) {
    options.error_messages = {
      ...EmailField.default_error_messages,
      ...options.error_messages,
    };
    super(options);
    let message = this.error_messages["invalid"];
    let validator = new EmailValidator({ message });
    this.validators.push(validator);
  }
}
