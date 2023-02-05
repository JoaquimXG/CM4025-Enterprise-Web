const BaseController = require("./BaseController");
const { Empty, SkipField } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class Controller extends BaseController {
  // TODO review error messages
  default_error_messages = {
    invalid: "Invalid data. Expected a dictionary, but got {datatype}.",
  };

  meta = {};

  _fields = null;

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
    // TODO check this whole function
    if (this.initial_data) {
      if (typeof this.initial_data !== "object") return {};

      return Object.fromEntries(
        Object.keys(this.fields)
          .map((field_name) => [field_name, this.fields[field_name]])
          .filter(
            ([_, field]) =>
              field.get_value(this.initial_data) !== Empty && !field.read_only
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

  // TODO get_value -> I don't think we need this one but need to check
  get_value(dictionary) {
    return dictionary[self.field_name];
  }

  run_validation(data = Empty()) {
    //TODO validators and validate() should return non_field errors
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
        // TODO should coerce this error into a non_field error
        // See DRF implementation
        throw e;
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
    for (let field in fields) {
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
    // TODO run through list of custom validators that are present on this class
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
      let validate_method = this["validate_" + field] || null;
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
    // TODO shouldn't neeed to stringify here
    if (Object.keys(errors).length !== 0)
      throw new ValidationError(JSON.stringify(errors));

    return data;
  }

  to_representation(instance) {
    let ret = {};
    let fields = this.readable_fields;

    for (let field in fields) {
      let attribute;
      try {
        attribute = field.get_attribute(instance);
      } catch (e) {
        if (e instanceof SkipField) continue;
        else throw e;
      }

      // TODO check for none on pk_only_fields
      if (attribute === null) ret[field.field_name] = null;
      else ret[field.field_name] = field.to_representation(attribute);
    }
    return ret;
  }

  validate(data) {
    // This is to allow additional multi-field validation when overriding the base class
    return data;
  }

  //TODO iter and getitem implementations -> I am not convinced they will be required for this simple app

  get data() {
    ret = super.data;
    // TODO ReturnDict is used in DRF, stores a reference to the current serializer alongside data
    // May not be required in our case
    return ret;
  }

  get errors() {
    //TOOD similar point here, there is an additional point about coeercing errors, review DRF implementation
    ret = super.errors;
    return ret;
  }
};
