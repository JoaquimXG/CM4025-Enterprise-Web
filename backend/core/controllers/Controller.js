const BaseController = require("./BaseController");
const { Empty } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class Controller extends BaseController {
  // TODO review error messages
  default_error_messages = {
    invalid: _("Invalid data. Expected a dictionary, but got {datatype}."),
  };

  fields = {};
  _fields = null;

  get fields() {
    if (this._fields === null) {
      //Loop through fields object and bind them
      this._fields = {};
      for (key in this.get_fields()) {
        field = this.fields[key];
        this.bind_field(field);
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

  // Allows overriding logic for getting fields in child classes
  // Used by fields getter
  get_fields() {
    return this.fields;
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

  run_validation(data = Empty) {}

  run_validation(data = Empty()) {
    //TODO validators and validate() should return non_field errors
    [is_empty_value, data] = validate_empty_values(data);

    if (is_empty_value) return data;

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
    for (field in fields) {
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
    //
    if (typeof data === "object") {
      to_validate = this.read_only_defaults();
      to_validate = { ...to_validated, ...data };
    } else {
      to_validate = data;
    }
    super().run_validators(to_validate);
  }

  to_internal_value(data) {
    if (typeof data !== "object")
      throw new ValidationError("Data must be an object, not null");

    ret = {};
    errors = {};
    fields = self.writeable_fields;

    for (field in fields) {
      validate_method = self["validate_" + field] || null;
      primitive_value = field.get_value(data);
      try {
        validated_value = fields[field].run_validation(primitive_value);
        if (validate_method) {
          validated_value = validate_method(validated_value);
        }
        ret[field] = validated_value;
      } catch (e) {
        if (e instanceof SkipField) continue;
        if (e instanceof ValidationError) errors[field] = e.message;
        else throw e;
      }
    }
    if (errors !== {}) throw new ValidationError(errors);

    return data;
  }

  to_representation(instance) {
    ret = {};
    fields = this.readable_fields;

    for (field in fields) {
      try {
        let attribute = field.get_attribute(instance);
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
