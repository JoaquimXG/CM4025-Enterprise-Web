const BaseController = require("./BaseController");
const { Empty, SkipField } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class Controller extends BaseController {
  // TODO review error messages
  staticdefault_error_messages = {
    invalid: "Invalid data. Expected a dictionary, but got {datatype}.",
  };

  meta = {};

  _fields = null;
  
  constructor(options = {}) {
    options.error_messages = {
      ...Controller.default_error_messages,
      ...options.error_messages,
    };
    super(options);
  }

  get fields() {
    if (this._fields === null) {
      // Loop through fields and bind them
      this._fields = {};
      let declared_fields = this.get_fields();
      for (let key in declared_fields) {
        let field = declared_fields[key];
        field.bind(key, this);
        this._fields[key] = field;
      }
    }
    return this._fields;
  }

  get writeable_fields() {
    return Object.values(this.fields).filter((field) => !field.read_only);
  }
  get readable_fields() {
    return Object.values(this.fields).filter((field) => !field.write_only);
  }

  get_declared_fields() {
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
  get_fields() {
    return structuredClone(this.get_declared_fields());
  }

  get_validators() {
    if (!self.meta || !self.meta.validators) return [];

    return self.meta.validators;
  }

  get_initial() {
    if (this.initial_data) {
      if (typeof this.initial_data !== "object") return {};

      return Object.fromEntries(
        Object.keys(this.fields)
          .map((field_name) => [field_name, this.fields[field_name]])
          .filter(
            ([_, field]) =>
              !field.get_value(this.initial_data) instanceof Empty && !field.read_only
          )
      );
    }

    return Object.fromEntries(
      Object.keys(this.fields)
        .map((field_name) => [
          field_name,
          this.fields[field_name].get_initial(),
        ])
        .filter(([_, field]) => !field.read_only)
    );
  }

  get_value(dictionary) {
    return dictionary[self.field_name];
  }

  run_validation(data = new Empty()) {
    let is_empty_value;
    [is_empty_value, data] = this.validate_empty_values(data);

    if (is_empty_value) return data;
    let value;

    try {
      value = this.to_internal_value(data);
      this.run_validators(value); // Should throw errors if invalid
      value = this.validate(value);
    } catch (e) {
      if (e instanceof ValidationError)
        throw new ValidationError({ non_field_errors: e.message });
      else throw e;
    }
    if (value === null) {
      throw new Error("Validate should return validated data, not null");
    }

    return value;
  }

  read_only_defaults() {
    let fields = Object.values(this.fields).filter(
      (field) =>
        field.read_only &&
        field.default !== Empty &&
        field.source != "*" &&
        !field.source.includes(".")
    );

    let defaults = {};
    for (let field of fields) {
      try {
        let defaultValue = field.get_default();
        defaults[field.source] = defaultValue;
      } catch (e) {
        if (e instanceof SkipField) continue;
        else throw e;
      }
    }
  }

  run_validators(data) {
    // DRF run through list of custom validators that are present on this class
    // I think this is unlikely to be used much for the controller but is likely to be used
    // Extensively for Field
    let to_validate;
    if (typeof data === "object") {
      to_validate = this.read_only_defaults();
      to_validate = { ...to_validate, ...data };
    } else {
      to_validate = data;
    }
    super.run_validators(to_validate);
  }

  to_internal_value(data) {
    if (typeof data !== "object")
      throw new ValidationError("Data must be an object, not null");

    let ret = {};
    let errors = {};
    let fields = this.writeable_fields;

    for (let field of fields) {
      let validate_method = this["validate_" + field.field_name] || null;
      let primitive_value = field.get_value(data);
      try {
        let validated_value = field.run_validation(primitive_value);
        if (validate_method) {
          validated_value = validate_method(validated_value);
        }
        ret[field.field_name] = validated_value;
      } catch (e) {
        if (e instanceof SkipField) continue;
        if (e instanceof ValidationError) errors[field.field_name] = e.message;
        else throw e;
      }
    }
    if (Object.keys(errors).length !== 0) throw new ValidationError(errors);

    return ret;
  }

  _to_representation(instance, fields) {
    let ret = {};

    for (let field of fields) {
      let attribute;
      try {
        attribute = field.get_attribute(instance);
      } catch (e) {
        if (e instanceof SkipField) continue;
        else throw e;
      }

      // DRF check for none on pk_only_fields
      if (attribute === null) ret[field.field_name] = null;
      else ret[field.field_name] = field.to_representation(attribute);
    }
    return ret;
  }

  to_representation(data) {
    let ret = this.many ? [] : {};
    let fields = this.readable_fields;
    // DRF should use a proper ListController but this is fine for now

    if (this.many) {
      for (let instance of data)
        ret.push(this._to_representation(instance, fields));
    } else ret = this._to_representation(data, fields);

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
