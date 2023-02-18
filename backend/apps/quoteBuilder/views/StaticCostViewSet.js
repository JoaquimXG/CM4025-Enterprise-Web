const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { StaticCostController } = require("../controllers");

module.exports = class StaticCostViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.StaticCost;
  controllerClass = StaticCostController;
};
