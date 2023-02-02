const Empty = require("../fields/Empty");
// TODO maps model fields to controller fields
field_mapping = {};

// TODO review all errors, change text and update to use ValidationError

// TODO move
class SkipField extends Error {}

// TODO extend from ApiException
class ValidationError extends Error {}

// TODO probably extend from Field base class
/* TODO split class heirarchy more strictly 
  * 1. Field
      - Holds logic that sits between all fields and all controllers
        - Not sure, need to review
  * 2. BaseController
      - Holds logic that is between standard controllers which allow arbitraty fields and modelcontroller
  * 3. Controller
      - Logic for arbitrary declared fields
  * 4. Model Controller
      - As above but also auto-generates fields based on a model
  *
  * Controller extends from Field because controller can be used as a nested field on another controller
*/

module.exports = class ModelController {
  model = null;
  _errors = null;

  // TODO should be able to define fields as a list of strings as field names
  field_names = [];
  fields = {};

  constructor(instance, data = null, partial = false) {
    this.instance = instance;
    this.initial_data = data;
    this.partial = partial;
    this.model_attributes = this.model.getAttributes();
  }

  build_field(field_name) {
    // Create field from model field
    if (field_name in this.model_attributes) {
      field_definition = this.model_attributes[field_name];
      field = new field_mapping[field_definition.type](field_name);
      return field;
      // TODO create relational field and deal with how that works
    }
  }

  get_fields() {
    fields = {};
    for (field_name of this.field_names) {
      if (!(field_name in this.fields)) {
        fields[field_name] = this.build_field(field_name);
      }
    }
    return fields;
  }

  validate(data) {
    // This is to allow additional multi-field validation when overriding the base class
    return data;
  }

  run_validators(data) {
    // TODO run through list of custom validators that are present on this class
    // I think this is unlikely to be used much for the controller but is likely to be used
    // Extensively for Field
    throw new Error("Not implemented");
  }

  validate_empty_value(value) {
    // TODO check if empty values are allowed, will be defined when the serializer is instantiated
    throw new Error("Not implemented");
  }

  run_validation(data = Empty()) {
    [is_empty_value, data] = validate_empty_values(data);

    if (is_empty_value) return data;

    value = this.to_internal_value(data);
    this.run_validators(value); // Should throw errors if invalid
    value = this.validate(value);
    if (value === null) {
      throw new Error("validate should return validated data, not null");
    }

    return value;
  }

  is_valid(raiseException = false) {
    if (this.initial_data === null) {
      throw new Error(
        "Data must be passed to controller before calling is_valid"
      );
    }
    // TODO confirm that controller was initialised with data

    if (this.validated_data === undefined) {
      try {
        this._validated_data = this.run_validation(this.initial_data);
        this._errors = null;
      } catch {
        // TODO should specifically catch validation errors from fields
        self.validated_data = {};
        self.validated = false;
        // TODO improve errors
        this._errors = [{ message: "There have been some errors" }];
      }
    }

    if (this._errors && raiseException) {
      throw new Error("Should be a validation error");
    }
    return this._errors === null;
  }

  to_internal_value(data) {
    if (type(data) !== "object") {
      throw new Error("Data must be an object");
    }

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
        if (e instanceof SkipField) {
          continue;
        }
        if (e instanceof ValidationError) {
          errors[field] = e.message;
        }
      }
    }

    return data;
  }

  to_representation(instance) {
    //TODO
    return instance;
  }

  update(instance, data) {
    return instance.update(data);
  }

  create(data) {
    return this.model.create(data);
  }

  save() {
    if (!this.validated) {
      throw new Error("Cannot save unvalidated data");
    }

    if (errors !== null) {
      throw new Error("Cannot save data with errors");
    }

    if (this._data !== null) {
      throw new Error("Cannot save after accessing data");
    }

    if (this.instance) {
      return this.update(this.instance, this.validated_data);
    } else {
      return this.create(this.validated_data);
    }
  }

  get fields() {
    if (!this._fields) {
      this._fields = this.get_fields();
    }
    return this._fields;
  }

  get writeable_fields() {
    return this.fields.filter((field) => !field.read_only);
  }

  get readable_fields() {
    return this.fields.filter((field) => !field.write_only);
  }

  get errors() {
    if (!this.validated) {
      throw new Error("Must validate before getting errors");
    }
    return this._errors;
  }

  get data() {
    if (!this.validated) {
      throw new Error("Must validate before getting data");
    }

    if (this._data === null) {
      if (this.instance && this._errors === null) {
        this._data = this.to_representation(this.instance);
      } else if (this._errors === null) {
        this._data = this.to_representation(this.validated_data);
      }
    }

    return this._data;
  }

  get validated_data() {
    if (!this.validated) {
      throw new Error("Must call is_valid before accessing validated_data");
    }
    return this._validated_data;
  }
};
