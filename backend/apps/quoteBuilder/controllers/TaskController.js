const ModelController = require("../../../core/controllers/ModelController");
const {
  DeclaredField,
  UserRestrictedPrimaryKeyRelatedField,
  CharField,
} = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TaskController extends ModelController {
  Quote = new DeclaredField(UserRestrictedPrimaryKeyRelatedField, {
    model: sequelize.models.Task,
    targetModel: sequelize.models.Quote,
    // Not required when updating but we will enforce required in create
    required: false,
  });
  _quoteName = new DeclaredField(CharField, {
    source: "Quote.name",
    readOnly: true,
  });

  meta = {
    model: sequelize.models.Task,
    fields: "__all__",
  };

  async create(validatedData) {
    if (!("QuoteId" in validatedData)) {
      throw new ValidationError({ Quote: "This field is required" });
    }
    return await super.create(validatedData);
  }
};
