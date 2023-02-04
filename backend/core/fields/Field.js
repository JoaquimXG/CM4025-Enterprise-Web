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
  };

  // TODO review
  default_error_messages = {
    required: _("This field is required."),
    null: _("This field may not be null."),
  };

  //TODO(IMPORTANT) merge with options
  default_validators = [];
  default_empty_html = new Empty();
  initial = null;

  default_options = {
    read_only: false,
    write_only: false,
    allow_null: false,
    default: new Empty(),
    initial: new Empty(),
    source: null,
    label: null,
    help_text: null,
    style: null,
    error_messages: null,
    validators: null,
  };

  constructor(options = {}) {
    //Merge defaults with inputs
    options = { ...default_options, ...options };

    // If required is not set, should be true if no default and not read only
    if (options.required === undefined)
      this.required = options.default === new Empty() && !options.read_only;

    // Some options combinations are invalid
    if (options.read_only && options.write_only)
      throw new Error(NOT_READ_ONLY_WRITE_ONLY);
    if (options.read_only && options.required)
      throw new Error(NOT_READ_ONLY_REQUIRED);
    if (options.required && options.default !== new Empty())
      throw new Error(NOT_REQUIRED_DEFAULT);
    // TODO USE_READONLYFIELD

    this.read_only = options.read_only;
    this.write_only = options.write_only;
    this.allow_null = options.allow_null;
    this.required = options.required;
    this.default = options.default;
    this.source = options.source;
    this.initial =
      options.initial === new Empty() ? self.initial : options.initial;
    this.label = options.label;
    this.help_text = options.help_text;
    this.style = options.style === null ? {} : options.style;

    // TODO default_empty_html
    this.validators = options.validators;

    // These are set on calls to bind() when field is added to a serializer
    this.field_name = null;
    this.parent = null;

    // TODO get static default_error attributes from parent class
  }

  bind(field_name, parent) {
    if (field_name === this.source)
      throw new Error("Avoid redundantly setting source matching field name");

    this.field_name = field_name;
    this.parent = parent;

    if (this.label === null)
      self.label = field_name.split(/(?=[A-Z])/).join(" ");

    if (this.source === null) this.source = field_name;

    // TODO this will need to be passed to sequelize to load database objects
    if (self.source === "*") self.source_attrs = [];
    else self.source_attrs = self.source.split(".");
  }

  get validators() {
    if (this._validators === undefined)
      this._validators = this.get_validators();
    return this._validators;
  }

  set validators(validators) {
    this._validators = validators;
  }

  // Allows complex overrides in child class
  get_validators() {
    return this.default_validators;
  }

  get_initial() {
    if (this.inital instanceof Function) return this.initial();
    return this.initial;
  }

  get_value(data) {
    // TODO need to think about how to handle non-JSON data, e.g., form data
    // I think the answer is that we don't handle it, because what is the point??
    return data[field_name];
  }

  _get_attribute(instance, source_attrs) {
    for (let attr of source_attrs) {
      if (typeof instance === "object") instance = instance[attr];
      // TODO need to review this,
      // it is likely that an instance will be from sequelize
      // so need to think about what the standard method of
      // getting attributes from sequelize is
      else instance.get(attr);
      //TODO some other error handling is going to be required here
    }
  }

  get_attribute(instance) {
    try {
      return this._get_attribute(instance, this.source_attrs);
    } catch (e) {
      // TODO what errors are here
      // Probably a object missing attribute error
      // Worth reviewing DRF implementation when testing
    }
  }

  get_default() {
    if (this.defualt === new Empty() || this.root.partial === true)
      // No default, or this is a partial update.
      throw new SkipField();
    if (this.default instanceof Function) {
      // TODO not sure about passing context in javascript, how can a
      // callable have additional attributes??
      // Apparently they can but this needs some reading
      if (this.default.requires_context) {
        return this.default(this);
      } else {
        return this.default();
      }
    }
    return this.default;
  }

  validate_empty_values(data) {
    if (this.read_only) return [true, this.get_default()];

    if (data === new Empty()) {
      if (this.root.partial) throw new SkipField();
      if (this.required) this.fail("required");
      return [true, this.get_default()];
    }

    if (data === null) {
      if (!this.allow_null) this.fail("null");
      // TODO review
      if (this.source === "*") return [false, data];
      throw new SkipField();
    }

    return [false, data];
  }

  run_validation(data = new Empty()) {
    [is_empty_value, data] = this.validate_empty_values(data);
    if (is_empty_value) return data;
    value = this.to_internal_value(data);
    this.run_validators(value);
    return value;
  }

  run_validators(value) {
    errors = [];
    for (let validator of this.validators) {
      try {
        this.run_validator(validator, value);
      } catch (e) {
        if (e instanceof ValidationError) {
          //TODO this is probably not going to work
          if (e.detail instanceof Object) {
            throw e;
          }
          errors.concat(e.detail);
        }
      }
    }
    if (errors.length) throw new ValidationError(errors);
  }

  run_validator(validator, value) {
    /*
     * In addition to run_validators logic taken from DRF.
     * Due to the lack of __call_ or similar in javascript to create callable
     * objects, a check has to be made to see if the validator is a simple function
     * or a subclass of BaseValidator.
     */
    args = [value];
    if (validator.requires_context) {
      args.push(this);
    }

    if (validator instanceof Function) {
      validator(...args);
    } else if (validator instanceof BaseValidator) {
      validator.validate(...args);
    }
  }

  to_internal_value(data) {
    // TODO extend error message should include class name and desdription
    // See DRF implementation
    throw new Error("Not Implemented");
  }

  to_representation(data) {
    // TODO extend error message should include class name and desdription
    // See DRF implementation
    throw new Error("Not Implemented");
  }

  fail(error_key) {
    message = this.error_messages[error_key];
    if (message === undefined) {
      message = MISSING_ERROR_MESSAGE(this.constructor.name, error_key);
      throw new Error(message);
    }
    throw new ValidationError(message);
  }

  get root() {
    root = this;
    while (root.parent !== null) {
      root = root.parent;
    }
    return root;
  }

  get context() {
    if (this.root._context !== undefined) return this.root._context;
    return {};
  }
};
