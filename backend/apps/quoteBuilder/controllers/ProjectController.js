const ModelController = require("../../../core/controllers/ModelController");
const {
  DeclaredField,
  // PrimaryKeyRelatedField,
  UserRestrictedPrimaryKeyRelatedField,
} = require("../../../core/fields");
const sequelize = require("../../../core/db/sequelize");

module.exports = class ProjectController extends ModelController {
  User = new DeclaredField(UserRestrictedPrimaryKeyRelatedField, {
    model: sequelize.models.Project,
    targetModel: sequelize.models.User,
    required: false,
  });

  meta = {
    model: sequelize.models.Project,
    fields: "__all__",
  };

  async create(validatedData) {
    // Set User Id to default to the current user on create
    if (!("UserId" in validatedData)) {
      validatedData.UserId = this.context.req.user.id;
    }
    return await super.create(validatedData);
  }
};
