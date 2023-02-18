const Field = require("./Field");

module.exports = class RelatedField extends Field {
  model = null;

  constructor({ model, targetModel, targetKey, many, ...options } = {}) {
    super(options);
    this.model = model;
    this.targetModel = targetModel;
    this.targetKey = this.targetKey ? targetKey : "id";
    this.many = many ? many : false;

    if (this.model === null && options.readOnly === false)
      throw new Error("Model must be specified");

    if (this.model !== null && options.readOnly === true)
      throw new Error("Model cannot be specified when read only");
  }

  runValidation(data) {
    if (data === "") {
      data = null;
    }
    return super.runValidation(data);
  }

  usePkOnlyOptimization() {
    return false;
  }

  getAttribute(instance) {
    if (this.usePkOnlyOptimization() && this.sourceAttrs && !this.many) {
      let attributeInstance = instance;
      for (let attr of this.sourceAttrs.slice(0, -1))
        attributeInstance = this._getAttribute(attributeInstance, attr);

      // Pull just ID instead of the whole object, appending "Id" to the end of the attribute name
      // Because Sequelize adds "Id" to the end of foreign keys by default
      const value = attributeInstance[this.sourceAttrs.slice(-1)[0] + "Id"];
      return { [this.targetKey]: value };
    }

    return super.getAttribute(instance); // This will use the default implementation
  }
};
