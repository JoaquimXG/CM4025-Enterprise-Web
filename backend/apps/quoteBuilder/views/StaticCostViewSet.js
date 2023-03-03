const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { StaticCostController } = require("../controllers");
const { CurrentUserAccessPolicyFilter } = require("../../../core/filters");

module.exports = class StaticCostViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];
  accessPolicy = CurrentUserAccessPolicyFilter;

  model = sequelize.models.StaticCost;
  controllerClass = StaticCostController;
};
