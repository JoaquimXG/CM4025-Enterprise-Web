const { Empty, SkipField } = require("../fields");
const { ValidationError } = require("../responses/errors");
// TODO maps model fields to controller fields
field_mapping = {};

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
  initial_data = null;

  // TODO should be able to define fields as a list of strings as field names
  field_names = [];
  fields = {};

  constructor(instance, data = Empty, partial = false, ...args) {
    this.instance = instance;
    if (data !== Empty) this.initial_data = data;
    this.partial = partial;
    this.model_attributes = this.model.getAttributes();
    super(...args);
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

  validate_empty_value(value) {
    // TODO check if empty values are allowed, will be defined when the serializer is instantiated
    // TODO should be defined on Field base class
    throw new Error("Not implemented");
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

  // TODO override to get model fields
  get fields() {
    if (!this._fields) {
      this._fields = this.get_fields();
    }
    return this._fields;
  }
};
