const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class PartialExcludeController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    exclude: ["createdAt", "updatedAt", "notNullableDefault"],
  };
};
