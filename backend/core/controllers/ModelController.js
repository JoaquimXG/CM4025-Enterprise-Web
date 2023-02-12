const { ValidationError } = require("../responses/errors");
const {
  Field,
  CharField,
  IntegerField,
  EmailField,
  BooleanField,
  ChoiceField,
  DateTimeField,
} = require("../fields");
const Controller = require("./Controller");

field_mapping = {
  CharField: CharField,
  IntegerField: IntegerField,
  EmailField: EmailField,
  BooleanField: BooleanField,
  DateTimeField: DateTimeField,
  DATETIME: DateTimeField,
};

ALL_FIELDS = "__all__";

/* TODO Write docs, include notes on meta field below
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
// Note: this is really a SequelizeModelController, there is some base functionality
// that could be shared with other model controllers using other ORMs but this is likely out of scope
module.exports = class ModelController extends Controller {
  // meta = {
  //   model: null, // sequelize model class to use
  //   fields: null, // list of field names, or ALL_FIELDS
  //   exclude: [], // list of field names, or ALL_FIELDS
  //   read_only_fields: [], // list of field names, or ALL_FIELDS
  //   extra_options: {}, // dictionary of field names to keyword options for field
  // };

  create(validated_data) {
    let model = this.meta.model;
    /**
     * TODO(RELATIONS)
     * 1. Raise errors on nested writes before attempting to create instance
     * 2. Pop many-to-many relationships from data before create ready to be added after instance is created later
     * 3. Manually create many-to-many relationships saved in step 2 after instance is created
     */
    try {
      instance = model.create(validated_data);
    } catch (e) {
      throw new ValidationError(e);
    }
    return instance;
  }

  update(instance, validated_data) {
    /**
     * TODO(RELATIONS)
     * 1. Raise errors on nested writes before attempting to update instance
     * 2. Handle many to many relationship updates (ID only)
     */
    try {
      return instance.update(validated_data);
    } catch (e) {
      throw new ValidationError(e);
    }
  }

  get_field_info(model) {
    let fields = model.rawAttributes;
    let pk_field_name = model.primaryKeyField;
    let pk_field = fields[pk_field_name];
    // TODO(RELATIONS) Get relationship fields

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
    // TODO(RELATIONS) depth for relations, I think I won't use depth here and instead will focus on using nested controllers
    // Depth has some weird consequences for writes that I don't want to deal with
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
    let fieldsWithoutDeletedAt = Object.keys(model_info.fields).filter(
      (field) => field !== "deletedAt"
    );
    return new Set([
      model_info.pk.fieldName,
      ...fieldsWithoutDeletedAt,
      ...Object.keys(declared_fields),
      // TOOD(RELATIONS) forward relations
    ]);
  }

  include_extra_options(options, extra_options) {
    if (extra_options.read_only) {
      for (let key of [
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
    if (this.meta.read_only_fields === undefined) return extra_options;

    if (!Array.isArray(this.meta.read_only_fields))
      throw new TypeError("read_only_fields must be an array");

    for (let field of this.meta.read_only_fields) {
      if (!(field in extra_options)) extra_options[field] = { read_only: true };
      else extra_options[field].read_only = true;
    }

    // Set "createdAt" and "updatedAt" and "deletedAt" to read only
    extra_options = this.force_read_only_fields(
      extra_options,
      "createdAt",
      "updatedAt",
      "deletedAt"
    );
    return extra_options;
  }

  force_read_only_fields(extra_options, ...fields) {
    for (let field of fields) {
      if (!(field in extra_options)) extra_options[field] = { read_only: true };
      else extra_options[field].read_only = true;
    }
    return extra_options;
  }

  build_field(field_name, info, model, nested_depth = 1) {
    if (field_name in info.fields) {
      let model_field = info.fields[field_name];
      return this.build_standard_field(field_name, model_field);
    }
    throw new Error("Have not implemented other types of field yet");
  }

  build_standard_field(field_name, model_field) {
    model_field = model_field.customFieldOptions
      ? { ...model_field, ...model_field.customFieldOptions }
      : model_field;

    let field_type = model_field.controllerType
      ? model_field.controllerType
      : String(model_field.type);

    let field_class = field_mapping[field_type];

    if (!field_class)
      throw new Error(
        `No field class found for field type ${model_field.type}`
      );

    let field_options = this.get_field_options(
      field_name,
      model_field,
      field_class
    );

    if (model_field.choices) {
      field_class = ChoiceField;
      let valid_options = new Set([
        "read_only",
        "write_only",
        "required",
        "default",
        "initial",
        "source",
        "error_messages",
        "validators",
        "allow_null",
        "allow_blank",
        "choices",
      ]);
      for (let key of Object.keys(field_options)) {
        if (!valid_options.has(key)) {
          delete field_options[key];
        }
      }
    }

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

    let validator_option = model_field.validators || [];

    // DRF max_digits? decimal_places? for decimal field

    if (model_field.allowNull) options.allow_null = true;

    // Return early for read only fields
    if (model_field._autoGenerated || model_field.autoIncrement) {
      options.read_only = true;
      return options;
    }

    if (model_field.defaultValue || model_field.allowNull)
      options.required = false;

    if (model_field.blank && Field.is_child(field_class, CharField))
      options.allow_blank = true;

    if (model_field.choices) options.choices = model_field.choices;
    else {
      let max_value = model_field.maxValue || null;
      if (
        max_value &&
        Field.is_child(field_class, [IntegerField, DateTimeField])
      ) {
        options.max_value = max_value;
      }

      let min_value = model_field.minValue || null;
      if (
        min_value &&
        Field.is_child(field_class, [IntegerField, DateTimeField])
      ) {
        options.min_value = min_value;
      }
    }

    let max_length = model_field.maxLength || null;
    if (max_length && Field.is_child(field_class, CharField)) {
      options.max_length = max_length;
      delete validator_option.maxLength;
    }

    let min_length = model_field.minLength || null;
    if (min_length && Field.is_child(field_class, CharField)) {
      options.min_length = min_length;
      delete validator_option.minLength;
    }

    /// DRF unique validator, sequelize offers a unique constraint but this is database layer
    // Application layer should perform validation on uniqueness before passing to sequelize
    // even if just for producing better

    options.validators = validator_option;
    return options;
  }
};
