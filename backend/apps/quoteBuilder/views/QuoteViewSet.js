const sequelize = require("../../../core/db/sequelize");
const { IsAuthenticated } = require("../../../core/permissions");
const { ModelViewSet } = require("../../../core/views");
const { QuoteController } = require("../controllers");

module.exports = class QuoteViewSet extends ModelViewSet {
  permissions = [new IsAuthenticated()];

  model = sequelize.models.Project;
  controllerClass = QuoteController;
};
