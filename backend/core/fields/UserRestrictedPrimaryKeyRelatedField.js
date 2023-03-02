const PrimaryKeyRelatedField = require("./PrimaryKeyRelatedField");

module.exports = class UserRestrictedPrimaryKeyRelatedField extends (
  PrimaryKeyRelatedField
) {
  constructor({ policy, ...options } = {}) {
    super(options);
  }

  scopeInstance(instance) {
    if (this.context.req.user.id !== instance.getUser(instance).id) return null;
    return instance;
  }
};
