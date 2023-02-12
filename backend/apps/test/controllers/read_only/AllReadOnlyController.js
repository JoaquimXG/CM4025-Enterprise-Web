const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class AllReadOnlyController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    exclude: ["createdAt", "updatedAt"],
    read_only_fields: ["nullableDefault", "notNullableDefault", "id"]
  };
};
