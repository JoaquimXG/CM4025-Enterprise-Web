const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class StaticCostController extends ModelController {
  meta = {
    model: sequelize.models.StaticCost,
    fields: "__all__",
  };
};
