const PrimaryKeyRelatedField = require("./PrimaryKeyRelatedField");

module.exports = class UserRestrictedPrimaryKeyRelatedField extends (
  PrimaryKeyRelatedField
) {
  constructor({ policy, ...options } = {}) {
    super(options);
  }

  async scopeInstance(instance) {
    let user = await instance.getUserRelation(instance);
    if (this.context.req.user.id !== user.id) return null;
    return instance;
  }
};
