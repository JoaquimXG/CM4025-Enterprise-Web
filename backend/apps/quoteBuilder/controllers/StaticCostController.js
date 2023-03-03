const ModelController = require("../../../core/controllers/ModelController");
const {
  DeclaredField,
  UserRestrictedPrimaryKeyRelatedField,
} = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const sequelize = require("../../../core/db/sequelize");

module.exports = class StaticCostController extends ModelController {
  Quote = new DeclaredField(UserRestrictedPrimaryKeyRelatedField, {
    model: sequelize.models.StaticCost,
    targetModel: sequelize.models.Quote,
    // Not required when updating but we will enforce required in create
    required: false,
  });

  meta = {
    model: sequelize.models.StaticCost,
    fields: "__all__",
  };

  async create(validatedData) {
    if (!("QuoteId" in validatedData)) {
      throw new ValidationError({ Quote: "This field is required" });
    }
    return await super.create(validatedData);
  }
};
