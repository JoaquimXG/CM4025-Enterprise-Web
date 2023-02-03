const Empty = require("./Empty");
const SkipField = require("./SkipField");
const { ValidationError } = require("../responses/errors");

NOT_READ_ONLY_WRITE_ONLY = "May not set both `read_only` and `write_only`";
NOT_READ_ONLY_REQUIRED = "May not set both `read_only` and `required`";
NOT_REQUIRED_DEFAULT = "May not set both `required` and `default`";
USE_READONLYFIELD = "Field(read_only=True) should be ReadOnlyField";
MISSING_ERROR_MESSAGE = (class_name, key) => `\
  ValidationError raised by '${class_name}', but error key '${key}' does \
  not exist in the 'error_messages' dictionary.`;

module.exports = class Field {
  error_messages = {
    required: "This field is required.",
    read_only: "This field is read only.",
    write_only: "This field is write only.",
    null: "This field may not be null.",
    invalid: "Invalid value.",
  }
  
  
  constructor (options = {}) {
    this.required = options.required || true; // TODO should be 
    this.read_only = options.read_only || false;
    this.write_only = options.write_only || false;
    this.allow_null = options.allow_null || false;
    this.default = options.default || null;
    this.partial = options.partial || false;
    //this.source??? I don't think this will be required
  }
  
  //TODO somehow set field name during controller initialization
  field_name = null;
  
  get_value(data) {
    // TODO need to think about how to handle non-JSON data, e.g., form data
    return data[field_name];
  }
  
  is_valid(value) {
    
  } 
  
  get_default() {
    if (this.default === null || this.partial)  {
      throw new Error("Skip this field")
    }
    // TODO allow function as default value
    return this.default;
  }
  
  fail(error_key) {
    message = this.error_messages[error_key];
    throw new Error(message); // TODO should be a ValidationException
  }
}