const BaseController = require("./BaseController");
const { Empty, SkipField } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class Controller extends BaseController {
  static defaultErrorMessages = {
    invalid: "Invalid data. Expected a dictionary, but got {datatype}.",
  };

  meta = {};

  _fields = null;

  constructor(options = {}) {
    options.errorMessages = {
      ...Controller.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);
  }

  get fields() {
    if (this._fields === null) {
      // Loop through fields and bind them
      this._fields = {};
      let declaredFields = this.getFields();
      for (let key in declaredFields) {
        let field = declaredFields[key];
        field.bind(key, this);
        this._fields[key] = field;
      }
    }
    return this._fields;
  }

  get writeableFields() {
    return Object.values(this.fields).filter((field) => !field.readOnly);
  }
  get readableFields() {
    return Object.values(this.fields).filter((field) => !field.writeOnly);
  }

  getDeclaredFields() {
    fields = {};
    for (key in this) {
      if (this[key] instanceof Field) {
        fields[key] = this[key];
      }
    }
    return fields;
  }

  // Allows overriding logic for getting fields in child classes
  // Used by fields getter
  getFields() {
    return structuredClone(this.getDeclaredFields());
  }

  getValidators() {
    if (!this.meta || !this.meta.validators) return [];

    return this.meta.validators;
  }

  getInitial() {
    if (this.initialData) {
      if (typeof this.initialData !== "object") return {};

      return Object.fromEntries(
        Object.keys(this.fields)
          .map((fieldName) => [fieldName, this.fields[fieldName]])
          .filter(
            ([_, field]) =>
              !field.getValue(this.initialData) instanceof Empty &&
              !field.readOnly
          )
      );
    }

    return Object.fromEntries(
      Object.keys(this.fields)
        .map((fieldName) => [fieldName, this.fields[fieldName].getInitial()])
        .filter(([_, field]) => !field.readOnly)
    );
  }

  getValue(dictionary) {
    return dictionary[this.fieldName];
  }

  async runValidation(data = new Empty()) {
    let isEmptyValue;
    [isEmptyValue, data] = this.validateEmptyValues(data);

    if (isEmptyValue) return data;
    let value;

    value = await this.toInternalValue(data);
    try {
      this.runValidators(value); // Should throw errors if invalid
      value = this.validate(value);
    } catch (e) {
      if (e instanceof ValidationError)
        throw new ValidationError({ nonFieldErrors: e.message });
      else throw e;
    }
    if (value === null) {
      throw new Error("Validate should return validated data, not null");
    }

    return value;
  }

  readOnlyDefaults() {
    let fields = Object.values(this.fields).filter(
      (field) =>
        field.readOnly &&
        field.default !== Empty &&
        field.source != "*" &&
        !field.source.includes(".")
    );

    let defaults = {};
    for (let field of fields) {
      try {
        let defaultValue = field.getDefault();
        defaults[field.source] = defaultValue;
      } catch (e) {
        if (e instanceof SkipField) continue;
        else throw e;
      }
    }
  }

  runValidators(data) {
    // DRF run through list of custom validators that are present on this class
    // I think this is unlikely to be used much for the controller but is likely to be used
    // Extensively for Field
    let toValidate;
    if (typeof data === "object") {
      toValidate = this.readOnlyDefaults();
      toValidate = { ...toValidate, ...data };
    } else {
      toValidate = data;
    }
    super.runValidators(toValidate);
  }

  async toInternalValue(data) {
    if (typeof data !== "object")
      throw new ValidationError("Data must be an object, not null");

    let ret = {};
    let errors = {};
    let fields = this.writeableFields;

    for (let field of fields) {
      let validateMethod = this["validate" + field.fieldName] || null;
      let primitiveValue = field.getValue(data);
      try {
        let validatedValue = await field.runValidation(primitiveValue);
        if (validateMethod) {
          validatedValue = validateMethod(validatedValue);
        }
        let writeFieldName = field.identifier
          ? field.identifier
          : field.fieldName;
        ret[writeFieldName] = validatedValue;
      } catch (e) {
        if (e instanceof SkipField) continue;
        if (e instanceof ValidationError) errors[field.fieldName] = e.message;
        else throw e;
      }
    }
    if (Object.keys(errors).length !== 0) throw new ValidationError(errors);

    return ret;
  }

  async _toRepresentation(instance, fields) {
    let ret = {};

    for (let field of fields) {
      let attribute;
      try {
        attribute = await field.getAttribute(instance);
      } catch (e) {
        if (e instanceof SkipField) continue;
        else throw e;
      }

      if (attribute === null || attribute === undefined)
        ret[field.fieldName] = null;
      else ret[field.fieldName] = await field.toRepresentation(attribute);
    }
    return ret;
  }

  async toRepresentation(data) {
    let ret = this.many ? [] : {};
    let fields = this.readableFields;
    // DRF should use a proper ListController but this is fine for now

    if (this.many) {
      for (let instance of data)
        ret.push(await this._toRepresentation(instance, fields));
    } else ret = await this._toRepresentation(data, fields);

    return ret;
  }

  validate(data) {
    // This is to allow additional multi-field validation when overriding the base class
    return data;
  }

  //DRF iter and getitem implementations -> I am not convinced they will be required for this simple app

  get data() {
    ret = super.data;
    // DRF ReturnDict is used in DRF, stores a reference to the current serializer alongside data
    // May not be required in our case
    return ret;
  }

  get errors() {
    //DRF similar point here, there is an additional point about coeercing errors, review DRF implementation
    ret = super.errors;
    return ret;
  }
};
