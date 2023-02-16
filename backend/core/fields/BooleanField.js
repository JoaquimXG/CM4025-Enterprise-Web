const Field = require("./Field");

module.exports = class BooleanField extends Field {
  static defaultErrorMessages = {
    invalid: "Must be a valid boolean.",
  };
  initial = false;
  TRUE_VALUES = new Set([
    "t",
    "T",
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "true",
    "True",
    "TRUE",
    "on",
    "On",
    "ON",
    "1",
    1,
    true,
  ]);
  FALSE_VALUES = new Set([
    "f",
    "F",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "false",
    "False",
    "FALSE",
    "off",
    "Off",
    "OFF",
    "0",
    0,
    0.0,
    false,
  ]);

  constructor(options = {}) {
    options.errorMessages = {
      ...BooleanField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);
  }

  NULL_VALUES = new Set(["null", "Null", "NULL", "", null]);

  toInternalValue(data) {
    if (this.TRUE_VALUES.has(data)) return true;
    if (this.FALSE_VALUES.has(data)) return false;
    if (this.NULL_VALUES.has(data) && this.allowNull) return null;
    this.fail("invalid");
  }

  toRepresentation(value) {
    if (this.TRUE_VALUES.has(value)) return true;
    if (this.FALSE_VALUES.has(value)) return false;
    if (this.NULL_VALUES.has(value) && this.allowNull) return null;
    return !!value;
  }
};
