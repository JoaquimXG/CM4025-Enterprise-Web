const { ValidationError } = require("../responses/errors");
const RelatedField = require("./RelatedField");

module.exports = class PrimaryKeyRelatedField extends RelatedField {
  static defaultErrorMessages = {
    required: "This field is required.",
    doesNotExist: (pk) => `Invalid pk "${pk}" - object does not exist.`,
    incorrectType: (type) =>
      `Incorrect type. Expected pk value, received ${type}.`,
  };

  constructor({ pkField, ...options } = {}) {
    options.errorMessages = {
      ...PrimaryKeyRelatedField.defaultErrorMessages,
      ...options.errorMessages,
    };
    super(options);
    this.pkField = pkField;
  }

  usePkOnlyOptimization() {
    return true;
  }

  toInternalValue(data) {
    if (this.pkField) {
      data = this.pkField.toInternalValue(data);
    }
    try {
      if (typeof data === "boolean") throw new TypeError();
      return this.model.findOne({ where: { id: data } });
    } catch (e) {
      throw ValidationError(e);
    }
  }

  _toRepresentation(value) {
    if (this.pkField)
      return this.pkField.toRepresentation(value[this.targetKey]);
    return value[this.targetKey];
  }

  toRepresentation(value) {
    // DRF should use a proper MultiRelationField but this is fine for now
    let ret = this.many ? [] : {};

    if (this.many) {
      for (let instance of value)
        ret.push(this._toRepresentation(instance));
    } else ret = this._toRepresentation(value);

    return ret;
  }
};
