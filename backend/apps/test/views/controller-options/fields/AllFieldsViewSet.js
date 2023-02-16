const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { AllFieldsController } = require("../../../controllers/fields");

module.exports = class AllFieldsViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controllerClass = AllFieldsController;
};
