const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class ExcludeAllController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    exclude: ["createdAt", "updatedAt", "nullableDefault", "notNullableDefault", "id"],
  };
};
