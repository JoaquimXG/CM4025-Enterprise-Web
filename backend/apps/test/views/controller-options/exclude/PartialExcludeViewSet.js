const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { PartialExcludeController } = require("../../../controllers/exclude");

module.exports = class PartialExcludeViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controllerClass = PartialExcludeController;
};
