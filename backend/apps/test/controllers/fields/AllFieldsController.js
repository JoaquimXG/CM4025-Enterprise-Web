const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class AllFieldsController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    fields: "__all__",
  };
};
