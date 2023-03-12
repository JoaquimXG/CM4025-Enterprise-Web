const Empty = require("./Empty");
const SkipField = require("./SkipField");
const { ValidationError } = require("../responses/errors");
const { BaseValidator } = require("./validators");

NOT_READ_ONLY_WRITE_ONLY = "May not set both `readOnly` and `writeOnly`";
NOT_READ_ONLY_REQUIRED = "May not set both `readOnly` and `required`";
NOT_REQUIRED_DEFAULT = "May not set both `required` and `default`";
USE_READONLYFIELD = "Field(readOnly=True) should be ReadOnlyField";
MISSING_ERROR_MESSAGE = (className, key) => `\
  ValidationError raised by '${className}', but error key '${key}' does \
  not exist in the 'errorMessages' dictionary.`;

module.exports = class Field {
  static defaultErrorMessages = {
    required: "This field is required.",
    readOnly: "This field is read only.",
    writeOnly: "This field is write only.",
    null: "This field may not be null.",
  };

  defaultValidators = [];

  defaultOptions = {
    readOnly: false,
    writeOnly: false,
    allowNull: false,
    default: new Empty(),
    initial: new Empty(),
    source: null,
    label: null,
    helpText: null,
    style: null,
    errorMessages: null,
    validators: null,
  };

  constructor(options = {}) {
    //Merge defaults with inputs
    options = { ...this.defaultOptions, ...options };
    this.errorMessages = {
      ...Field.defaultErrorMessages,
      ...options.errorMessages,
    };

    // If required is not set, should be true if no default and not read only
    if (options.required === undefined)
      this.required = options.default instanceof Empty && !options.readOnly;
    else this.required = options.required;

    // Some options combinations are invalid
    if (options.readOnly && options.writeOnly)
      throw new Error(NOT_READ_ONLY_WRITE_ONLY);
    if (options.readOnly && options.required)
      throw new Error(NOT_READ_ONLY_REQUIRED);
    if (options.required && !options.default instanceof Empty)
      throw new Error(NOT_REQUIRED_DEFAULT);
    // DRF USE_READONLYFIELD

    this.readOnly = options.readOnly;
    this.writeOnly = options.writeOnly;
    this.allowNull = options.allowNull;
    this.default = options.default;
    this.source = options.source;
    this.initial =
      options.initial === new Empty() ? this.initial : options.initial;
    this.label = options.label;
    this.helpText = options.helpText;
    this.style = options.style === null ? {} : options.style;

    this.validators = options.validators
      ? [...options.validators, ...this.defaultValidators]
      : this.defaultValidators;

    // These are set on calls to bind() when field is added to a serializer
    this.fieldName = null;
    this.parent = null;
  }

  bind(fieldName, parent) {
    if (fieldName === this.source)
      throw new Error("Avoid redundantly setting source matching field name");

    this.fieldName = fieldName;
    this.parent = parent;

    if (this.label === null)
      this.label = fieldName.split(/(?=[A-Z])/).join(" ");

    if (this.source === null) this.source = fieldName;

    if (this.source === "*") this.sourceAttrs = [];
    else this.sourceAttrs = this.source.split(".");
  }

  get validators() {
    if (this._validators === undefined) this._validators = this.getValidators();
    return this._validators;
  }

  set validators(validators) {
    this._validators = validators;
  }

  // Allows complex overrides in child class
  getValidators() {
    return this.defaultValidators;
  }

  getInitial() {
    if (this.inital instanceof Function) return this.initial();
    return this.initial;
  }

  getValue(data) {
    return data[this.fieldName];
  }

  async _getAttribute(instance, attr) {
    // Field is not a field but a relation and we want to return the object itself
    if (instance["get" + attr] instanceof Function)
      return await instance["get" + attr]();
    else return instance[attr];
  }

  async getAttribute(instance) {
    try {
      for (let attr of this.sourceAttrs)
        instance = await this._getAttribute(instance, attr);
      return instance;
    } catch (e) {
      throw e;
      // DRF worth reviewing erorrs here at some point
    }
  }

  getDefault() {
    if (this.default instanceof Empty || this.root.partial === true)
      // No default, or this is a partial update.
      throw new SkipField();
    if (this.default instanceof Function) {
      if (this.default.requiresContext) {
        return this.default(this);
      } else {
        return this.default();
      }
    }
    return this.default;
  }

  validateEmptyValues(data) {
    if (this.readOnly) return [true, this.getDefault()];

    if (data instanceof Empty) {
      if (this.root.partial) throw new SkipField();
      if (this.required) this.fail("required");
      return [true, this.getDefault()];
    }

    if (data === null) {
      if (!this.allowNull) this.fail("null");
      if (this.source === "*") return [false, data];
      return [true, data];
    }

    return [false, data];
  }

  async runValidation(data = new Empty()) {
    let isEmptyValue;
    [isEmptyValue, data] = this.validateEmptyValues(data);
    if (isEmptyValue) return data;
    let value = await this.toInternalValue(data);
    this.runValidators(value);
    return value;
  }

  runValidators(value) {
    let errors = [];
    for (let validator of this.validators) {
      try {
        this.runValidator(validator, value);
      } catch (e) {
        if (e instanceof ValidationError) {
          errors.push(e.message);
        } else {
          throw e;
        }
      }
    }
    if (errors.length) throw new ValidationError(errors);
  }

  runValidator(validator, value) {
    /*
     * In addition to runValidators logic taken from DRF.
     * Due to the lack of __call_ or similar in javascript to create callable
     * objects, a check has to be made to see if the validator is a simple function
     * or a subclass of BaseValidator.
     */
    let args = [value];
    if (validator.requiresContext) {
      args.push(this);
    }

    if (validator instanceof Function) {
      validator(...args);
    } else if (validator instanceof BaseValidator) {
      validator.validate(...args);
    }
  }

  async toInternalValue(data) {
    // DRF extend error message should include class name and desdription
    // See DRF implementation
    throw new Error("Not Implemented");
  }

  toRepresentation(data) {
    // DRF extend error message should include class name and desdription
    throw new Error("Not Implemented");
  }

  fail(errorKey, ...args) {
    let message = this.errorMessages[errorKey];
    if (message === undefined) {
      message = MISSING_ERROR_MESSAGE(this.constructor.name, errorKey);
      throw new Error(message);
    }
    if (message instanceof Function) {
      message = message(...args);
    }

    throw new ValidationError(message);
  }

  get root() {
    let root = this;
    while (root.parent !== null) {
      root = root.parent;
    }
    return root;
  }

  get context() {
    if (this.root._context !== undefined) return this.root._context;
    return {};
  }

  static isChild(fieldClass, types) {
    if (!Array.isArray(types)) types = [types];
    for (let type of types) {
      if (fieldClass.prototype instanceof type || fieldClass === type)
        return true;
    }
    return false;
  }
};
