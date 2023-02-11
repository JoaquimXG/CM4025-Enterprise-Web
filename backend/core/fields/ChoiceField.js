const Field = require("./Field");

module.exports = class ChoiceField extends Field {
  static default_error_messages = {
    invalid_choice: (input) => `'${input}' is not a valid choice`,
  };

  constructor({ choices, ...options } = {}) {
    options.error_messages = {
      ...ChoiceField.default_error_messages,
      ...options.error_messages,
    };
    super(options);
    this.choices = choices;
  }

  to_internal_value(data) {
    let res = this.choices[String(data)];
    if (res === undefined) this.fail("invalid_choice", data);
    return res;
  }

  to_representation(value) {
    return this.choices[String(value)];
  }

  get choices() {
    return this._choices;
  }

  set choices(choices) {
    // Map the string representation of choices to the underlying value.
    this._choices = Object.fromEntries(
      choices.map((key) => [String(key), key])
    );
  }
};
