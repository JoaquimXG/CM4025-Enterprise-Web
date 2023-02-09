const { Empty, SkipField } = require("../fields");
const { ValidationError } = require("../responses/errors");
const { DataTypes } = require("sequelize");
const { STRING, INTEGER } = DataTypes;
const { Field, CharField, IntegerField } = require("../fields");
const { options } = require("sequelize/lib/model");
const Controller = require("./Controller");

// TODO maps model fields to controller fields
field_mapping = {
  CharField: CharField,
  IntegerField: IntegerField,
};

ALL_FIELDS = "__all__";

/* TODO Write docs
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
// TODO this is really a SequelizeModelController, there is some base functionality
// that could be shared with other model controllers using other ORMs but this is likely out of scope
module.exports = class ModelController extends Controller {
  _errors = null;

  // meta = {
  // model: null, // sequelize model class to use
  // fields: null, // list of field names, or ALL_FIELDS
  // exclude: null, // list of field names, or ALL_FIELDS
  // read_only_fields: null, // list of field names, or ALL_FIELDS
  // extra_options: null, // dictionary of field names to keyword options for field
  // };

  create(validated_data) {
    let model = this.meta.model;
    // TODO raise errors on nested writes
    // TODO Pop many-to-many relationships from data before create ready to be added after instance is created later
    try {
      instance = model.create(validated_data);
    } catch (e) {
      // TODO get better error message on create, need to run some tests to see what errors are likely and explain here
      throw new ValidationError(e);
    }

    // TODO create many-to-many relationships saved above
    return instance;
  }

  update(instance, validated_data) {
    // TODO raise errors on nested writes
    // TODO(IMPORTANT) handle many-to-many relationships
    return instance.update(validated_data);
  }

  get_field_info(model) {
    // TODO there is also fieldRawAttributesMap, seemingly holds the same information but should review the differences
    let fields = model.rawAttributes;
    let pk_field_name = model.primaryKeyField;
    let pk_field = fields[pk_field_name];
    // TODO relations

    return { pk: pk_field, fields: fields };
  }

  get_declared_fields() {
    let declared_fields = {};
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof Field) {
        declared_fields[key] = value;
      }
    }
    return declared_fields;
  }

  get_fields() {
    let declared_fields = structuredClone(this.get_declared_fields());
    let model = this.meta.model;
    // TODO depth for relations
    let depth = 1;

    let info = this.get_field_info(model);
    let field_names = this.get_field_names(declared_fields, info);

    let extra_options = this.get_extra_options();

    let fields = {};
    for (let field_name of field_names) {
      // Use declared field if present, allows overriding model fields
      if (field_name in declared_fields) {
        fields[field_name] = declared_fields[field_name];
        continue;
      }

      let extra_field_options = extra_options[field_name] || {};
      let source = extra_field_options.source || field_name;

      let [field_class, field_options] = this.build_field(
        source,
        info,
        model,
        depth
      );

      // Include extra field options from meta
      field_options = this.include_extra_options(
        field_options,
        extra_field_options
      );

      fields[field_name] = new field_class(field_options);
    }

    return fields;
  }

  get_field_names(declared_fields, info) {
    /**
     * Returns a list of field names that this controller will validate
     * Field names are a combination of fields declared on the controller and fields on the model
     * All fields declared on the controller must be included in the fields list
     * and can't be excluded.
     */

    let fields = this.meta.fields;
    let exclude = this.meta.exclude;

    if (fields && fields !== ALL_FIELDS && !Array.isArray(fields)) {
      throw new TypeError(
        `The 'fields' option must be a list or tuple or "${ALL_FIELDS}". Got ${typeof fields}.`
      );
    }
    if (exclude && exclude !== ALL_FIELDS && !Array.isArray(exclude)) {
      throw new TypeError(
        `The 'fields' option must be a list or tuple or "${ALL_FIELDS}". Got ${typeof exclude}.`
      );
    }

    if (fields && exclude) {
      throw new TypeError(
        `Cannot set both 'fields' and 'exclude' options on serializer ${this.constructor.name}.`
      );
    }

    if (!fields && !exclude) {
      throw new TypeError(
        `Creating a ModelController without either the 'fields' attribute or the 'exclude' attribute is disallowed. Add an explicit fields = '__all__' to the ${this.constructor.name} serializer.`
      );
    }

    if (fields === ALL_FIELDS || fields === undefined) fields = null;

    // Ensure all declared fields are included in the meta.fields option
    let required_field_names = new Set(Object.keys(declared_fields));
    if (fields !== null) {
      for (let field_name of required_field_names) {
        if (!(field_name in fields)) {
          throw new Error(
            `The field '${field_name}' was declared on controller ${this.constructor.name}, but has not been included in the 'fields' option.`
          );
        }
      }

      return fields;
    }

    fields = this.get_default_field_names(declared_fields, info);

    if (exclude !== undefined) {
      for (let field_name of exclude) {
        if (field_name in required_field_names) {
          throw new Error(
            `The field '${field_name}' was declared on controller ${this.constructor.name}, but has been excluded by the 'exclude' option.`
          );
        }

        if (!fields.has(field_name)) {
          throw new Error(
            `The field '${field_name}' was excluded on controller ${this.constructor.name}, but is not included in the model fields.`
          );
        }
      }
      for (let field_name of exclude) fields.delete(field_name);
    }

    return fields;
  }

  get_default_field_names(declared_fields, model_info) {
    return new Set([
      model_info.pk.fieldName,
      ...Object.keys(model_info.fields),
      ...Object.keys(declared_fields),
      // TOOD forward relations
    ]);
  }

  include_extra_options(options, extra_options) {
    if (extra_options.read_only) {
      for (key of [
        "allow_blank",
        "required",
        "max_length",
        "min_length",
        "max_value",
        "min_value",
      ]) {
        delete options[key];
      }
    }
    if (extra_options.default && !options.required) {
      delete options.required;
    }

    if (extra_options.read_only || options.read_only) {
      delete extra_options.required;
    }

    options = { ...options, ...extra_options };
    return options;
  }

  get_extra_options() {
    let extra_options = structuredClone(this.meta.extra_options) || {};
    // TODO merge read_only_fields into extra_options
    return extra_options;
  }

  // TODO BELOW NEEDS TO BE REDONE

  build_field(field_name, info, model, nested_depth = 1) {
    if (field_name in info.fields) {
      let model_field = info.fields[field_name];
      return this.build_standard_field(field_name, model_field);
    }
    throw new Error("Have not implemented other types of field yet");
  }

  build_standard_field(field_name, model_field) {
    let field_type = model_field.customFieldOptions
      ? model_field.customFieldOptions.controllerType
      : String(model_field.type);
    let field_class = field_mapping[field_type];
    if (!field_class)
      throw new Error(
        `No field class found for field type ${model_field.type}`
      );
    let field_options = this.get_field_options(field_name, model_field, field_class);

    // Only allow blank on charfield TODO or choice field
    if (!field_class instanceof CharField) {
      delete field_options.allow_blank;
    }

    return [field_class, field_options];
  }

  get_field_options(field_name, model_field, field_class) {
    /**
     * Get all options for the field class
     * Options are taken from the model field definition
     * Custom options are used under customFieldOptions alongside standard options from sequelize
     * This is primarily because the validation options in sequelize are not very flexible and primary focus
     * on string validation.
     * Additionally validation is confused with constraints. In my opinion validation should be performed prior to
     * making any database calls.
     * e.g., sequelize has a allowNull option which enforces whether a database field can be null or not
     * This is a database level constraint, but the controller should validate the value before a null value
     * is entered into the database. Even, if only to provide a better error message.
     */
    let options = {};
    model_field = model_field.customFieldOptions
      ? { ...model_field, ...model_field.customFieldOptions }
      : model_field;

    let validator_option = model_field.validators || [];

    // TODO(LOW) max_digits? decimal_places?

    if (model_field.allowNull) options.allow_null = true;

    // Return early for read only fields
    if (model._autoGenerated || model.autoIncrement) {
      options.read_only = true;
      return options;
    }

    if (model_field.defaultValue || model_field.allowNull || model_field.blank)
      options.required = false;

    if (model_field.blank && field_class == CharField)
      options.allow_blank = true;

    if (model_field.choices) options.choices = model_field.choices;
    else {
      let max_value = model_field.maxValue || null;
      if (max_value && field_class == IntegerField) {
        // TODO extend to all number fields
        options.max_value = max_value;
      }

      let min_value = model_field.minValue || null;
      if (min_value && field_class == IntegerField) {
        // TODO extend to all number fields
        options.min_value = min_value;
      }
    }

    let max_length = model_field.maxLength || null;
    if (max_length && field_class == CharField) {
      // TODO extend to all text fields
      options.max_length = max_length;
      delete validator_option.maxLength;
    }

    let min_length = model_field.minLength || null;
    if (min_length && field_class == CharField) {
      // TODO extend to all text fields
      options.min_length = min_length;
      delete validator_option.minLength;
    }

    /// TODO unique validator, sequelize offers a unique constraint but this is database layer
    // Application layer should perform validation on uniqueness before passing to sequelize
    // even if just for producing better

    options.validators = validator_option;
    return options;
  }

  to_representation(instance) {
    //TODO
    return instance;
  }
};
