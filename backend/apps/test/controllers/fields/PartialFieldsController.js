const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class PartialFieldsController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    fields: ["createdAt", "nullableDefault", "id"],
  };
};
