const Field = require("./Field");

module.exports = class BooleanField extends Field {
  default_error_messages = {
    invalid: "Must be a valid boolean.",
  };
  default_empty_html = false;
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

  NULL_VALUES = new Set(["null", "Null", "NULL", "", null]);

  to_internal_value(data) {
    if (data in this.TRUE_VALUES) return true;
    if (data in this.FALSE_VALUES) return false;
    if (data in this.NULL_VALUES && this.allow_null) return null;
    this.fail("invalid", (input = data));
  }

  to_representation(value) {
    if (value in this.TRUE_VALUES) return true;
    if (value in this.FALSE_VALUES) return false;
    if (value in this.NULL_VALUES && this.allow_null) return null;
    return !!value;
  }
};
