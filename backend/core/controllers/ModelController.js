const { ValidationError } = require("../responses/errors");
const {
  Field,
  CharField,
  IntegerField,
  EmailField,
  BooleanField,
  ChoiceField,
  DateTimeField,
  DeclaredField,
} = require("../fields");
const { convertSequelizeValidationError } = require("../db/utils");
const Controller = require("./Controller");
const SequelizeValidationError = require("sequelize").ValidationError;

fieldMapping = {
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
  //   readOnlyFields: [], // list of field names, or ALL_FIELDS
  //   extraOptions: {}, // dictionary of field names to keyword options for field
  // };

  async create(validatedData) {
    let model = this.meta.model;
    /**
     * TODO(RELATIONS)
     * 1. Raise errors on nested writes before attempting to create instance
     * 2. Pop many-to-many relationships from data before create ready to be added after instance is created later
     * 3. Manually create many-to-many relationships saved in step 2 after instance is created
     */
    try {
      return await model.create(validatedData);
    } catch (e) {
      if (e instanceof SequelizeValidationError) {
        throw convertSequelizeValidationError(e);
      }
      throw new ValidationError(e);
    }
  }

  async update(instance, validatedData) {
    /**
     * TODO(RELATIONS)
     * 1. Raise errors on nested writes before attempting to update instance
     * 2. Handle many to many relationship updates (ID only)
     */
    try {
      return await instance.update(validatedData);
    } catch (e) {
      if (e instanceof SequelizeValidationError) {
        throw convertSequelizeValidationError(e);
      }
      throw new ValidationError(e);
    }
  }

  getFieldInfo(model) {
    let fields = model.rawAttributes;
    let pkFieldName = model.primaryKeyField;
    let pkField = fields[pkFieldName];
    // TODO(RELATIONS) Get relationship fields

    return { pk: pkField, fields: fields };
  }

  getDeclaredFields() {
    let declaredFields = {};
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof DeclaredField) {
        declaredFields[key] = value.getField();
      }
    }
    return declaredFields;
  }

  getFields() {
    let declaredFields = this.getDeclaredFields();
    let model = this.meta.model;
    // TODO(RELATIONS) depth for relations, I think I won't use depth here and instead will focus on using nested controllers
    // Depth has some weird consequences for writes that I don't want to deal with
    let depth = 1;

    let info = this.getFieldInfo(model);
    let fieldNames = this.getFieldNames(declaredFields, info);

    let extraOptions = this.getExtraOptions();

    let fields = {};
    for (let fieldName of fieldNames) {
      // Use declared field if present, allows overriding model fields
      if (fieldName in declaredFields) {
        fields[fieldName] = declaredFields[fieldName];
        continue;
      }

      let extraFieldOptions = extraOptions[fieldName] || {};
      let source = extraFieldOptions.source || fieldName;

      let [fieldClass, fieldOptions] = this.buildField(
        source,
        info,
        model,
        depth
      );

      // Include extra field options from meta
      fieldOptions = this.includeExtraOptions(
        fieldOptions,
        extraFieldOptions
      );

      fields[fieldName] = new fieldClass(fieldOptions);
    }

    return fields;
  }

  getFieldNames(declaredFields, info) {
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
    let requiredFieldNames = new Set(Object.keys(declaredFields));
    if (fields !== null) {
      for (let fieldName of requiredFieldNames) {
        if (!(fieldName in fields)) {
          throw new Error(
            `The field '${fieldName}' was declared on controller ${this.constructor.name}, but has not been included in the 'fields' option.`
          );
        }
      }

      return fields;
    }

    fields = this.getDefaultFieldNames(declaredFields, info);

    if (exclude !== undefined) {
      for (let fieldName of exclude) {
        if (fieldName in requiredFieldNames) {
          throw new Error(
            `The field '${fieldName}' was declared on controller ${this.constructor.name}, but has been excluded by the 'exclude' option.`
          );
        }

        if (!fields.has(fieldName)) {
          throw new Error(
            `The field '${fieldName}' was excluded on controller ${this.constructor.name}, but is not included in the model fields.`
          );
        }
      }
      for (let fieldName of exclude) fields.delete(fieldName);
    }

    return fields;
  }

  getDefaultFieldNames(declaredFields, modelInfo) {
    let fieldsWithoutDeletedAt = Object.keys(modelInfo.fields).filter(
      (field) => field !== "deletedAt"
    );
    return new Set([
      modelInfo.pk.fieldName,
      ...fieldsWithoutDeletedAt,
      ...Object.keys(declaredFields),
      // TOOD(RELATIONS) forward relations
    ]);
  }

  includeExtraOptions(options, extraOptions) {
    if (extraOptions.readOnly) {
      for (let key of [
        "allowBlank",
        "required",
        "maxLength",
        "minLength",
        "maxValue",
        "minValue",
      ]) {
        delete options[key];
      }
    }
    if (extraOptions.default && !options.required) {
      delete options.required;
    }

    if (extraOptions.readOnly || options.readOnly) {
      delete extraOptions.required;
    }

    options = { ...options, ...extraOptions };
    return options;
  }

  getExtraOptions() {
    let extraOptions = structuredClone(this.meta.extraOptions) || {};
    if (this.meta.readOnlyFields === undefined) return extraOptions;

    if (!Array.isArray(this.meta.readOnlyFields))
      throw new TypeError("readOnlyFields must be an array");

    for (let field of this.meta.readOnlyFields) {
      if (!(field in extraOptions)) extraOptions[field] = { readOnly: true };
      else extraOptions[field].readOnly = true;
    }

    // Set "createdAt" and "updatedAt" and "deletedAt" to read only
    extraOptions = this.forceReadOnlyFields(
      extraOptions,
      "createdAt",
      "updatedAt",
      "deletedAt"
    );
    return extraOptions;
  }

  forceReadOnlyFields(extraOptions, ...fields) {
    for (let field of fields) {
      if (!(field in extraOptions)) extraOptions[field] = { readOnly: true };
      else extraOptions[field].readOnly = true;
    }
    return extraOptions;
  }

  buildField(fieldName, info, model, nestedDepth = 1) {
    if (fieldName in info.fields) {
      let modelField = info.fields[fieldName];
      return this.buildStandardField(fieldName, modelField);
    }
    throw new Error("Have not implemented other types of field yet");
  }

  buildStandardField(fieldName, modelField) {
    modelField = modelField.customFieldOptions
      ? { ...modelField, ...modelField.customFieldOptions }
      : modelField;

    let fieldType = modelField.controllerType
      ? modelField.controllerType
      : String(modelField.type);

    let fieldClass = fieldMapping[fieldType];

    if (!fieldClass)
      throw new Error(
        `No field class found for field type ${modelField.type}`
      );

    let fieldOptions = this.getFieldOptions(
      fieldName,
      modelField,
      fieldClass
    );

    if (modelField.choices) {
      fieldClass = ChoiceField;
      let validOptions = new Set([
        "readOnly",
        "writeOnly",
        "required",
        "default",
        "initial",
        "source",
        "errorMessages",
        "validators",
        "allowNull",
        "allowBlank",
        "choices",
      ]);
      for (let key of Object.keys(fieldOptions)) {
        if (!validOptions.has(key)) {
          delete fieldOptions[key];
        }
      }
    }

    // Only allow blank on charfield TODO or choice field
    if (!fieldClass instanceof CharField) {
      delete fieldOptions.allowBlank;
    }

    return [fieldClass, fieldOptions];
  }

  getFieldOptions(fieldName, modelField, fieldClass) {
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

    let validatorOption = modelField.validators || [];

    // DRF maxDigits? decimalPlaces? for decimal field

    if (modelField.allowNull) options.allowNull = true;

    // Return early for read only fields
    if (modelField._autoGenerated || modelField.autoIncrement) {
      options.readOnly = true;
      return options;
    }

    if (modelField.defaultValue || modelField.allowNull)
      options.required = false;

    if (modelField.blank && Field.isChild(fieldClass, CharField))
      options.allowBlank = true;

    if (modelField.choices) options.choices = modelField.choices;
    else {
      let maxValue = modelField.maxValue || null;
      if (
        maxValue &&
        Field.isChild(fieldClass, [IntegerField, DateTimeField])
      ) {
        options.maxValue = maxValue;
      }

      let minValue = modelField.minValue || null;
      if (
        minValue &&
        Field.isChild(fieldClass, [IntegerField, DateTimeField])
      ) {
        options.minValue = minValue;
      }
    }

    let maxLength = modelField.maxLength || null;
    if (maxLength && Field.isChild(fieldClass, CharField)) {
      options.maxLength = maxLength;
      delete validatorOption.maxLength;
    }

    let minLength = modelField.minLength || null;
    if (minLength && Field.isChild(fieldClass, CharField)) {
      options.minLength = minLength;
      delete validatorOption.minLength;
    }

    /// DRF unique validator, sequelize offers a unique constraint but this is database layer
    // Application layer should perform validation on uniqueness before passing to sequelize
    // even if just for producing better

    options.validators = validatorOption;
    return options;
  }
};
