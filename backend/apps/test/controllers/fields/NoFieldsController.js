const ModelController = require("../../../../core/controllers/ModelController");
const sequelize = require("../../../../core/db/sequelize");

module.exports = class NoFieldsController extends ModelController {
  meta = {
    model: sequelize.models.ReadOnlyDefaultModel,
    fields: [],
  };
};
