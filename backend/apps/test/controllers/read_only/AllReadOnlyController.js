const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class AllReadOnlyController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    exclude: ["createdAt", "updatedAt"],
    readOnlyFields: ["nullableDefault", "notNullableDefault", "id"]
  };
};
