const ModelController = require("../../../core/controllers/ModelController");
const {
  DeclaredField,
  UserRestrictedPrimaryKeyRelatedField,
  CharField,
} = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const sequelize = require("../../../core/db/sequelize");

module.exports = class QuoteController extends ModelController {
  Project = new DeclaredField(UserRestrictedPrimaryKeyRelatedField, {
    model: sequelize.models.Quote,
    targetModel: sequelize.models.Project,
    // Not required when updating but we will enforce required in create
    required: false,
  });
  _projectName = new DeclaredField(CharField, {
    source: "Project.name",
    readOnly: true,
  });

  meta = {
    model: sequelize.models.Quote,
    fields: "__all__",
  };

  async create(validatedData) {
    if (!("ProjectId" in validatedData)) {
      throw new ValidationError({ Project: "This field is required" });
    }
    return await super.create(validatedData);
  }
};
