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

  async toInternalValue(data) {
    //TODO need to handle multi-relations
    if (this.pkField) {
      data = this.pkField.toInternalValue(data);
    }
    if (typeof data === "boolean") throw new TypeError();
    let instance = await this.targetModel.findOne({
      where: { [this.targetIdentifier]: data },
    });
    if (instance === null) this.fail("doesNotExist", data);
    return instance[this.targetIdentifier];
  }

  _toRepresentation(value) {
    if (this.pkField)
      return this.pkField.toRepresentation(value[this.targetIdentifier]);
    return value[this.targetIdentifier];
  }

  toRepresentation(value) {
    // DRF should use a proper MultiRelationField but this is fine for now
    let ret = this.many ? [] : {};

    if (this.many) {
      for (let instance of value) ret.push(this._toRepresentation(instance));
    } else ret = this._toRepresentation(value);

    return ret;
  }
};
