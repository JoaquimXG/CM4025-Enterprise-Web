const Field = require("./Field");

module.exports = class EmailField extends Field {
  default_error_messages = {
    invalid: "Enter a valid email address.",
  };

  constructor(options) {
    super(options);
    let message = this.error_messages["invalid"];
    let validator = new EmailValidator({ message });
    this.validators.push(validator);
  }
}
