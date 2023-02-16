const Field = require("./Field");

module.exports = class ChoiceField extends Field {
  static defaultErrorMessages = {
    invalidChoice: (input) => `'${input}' is not a valid choice`,
  };

  constructor({ choices, ...options } = {}) {
    options.errorMessages = {
      ...ChoiceField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);
    this.choices = choices;
  }

  toInternalValue(data) {
    let res = this.choices[String(data)];
    if (res === undefined) this.fail("invalidChoice", data);
    return res;
  }

  toRepresentation(value) {
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
