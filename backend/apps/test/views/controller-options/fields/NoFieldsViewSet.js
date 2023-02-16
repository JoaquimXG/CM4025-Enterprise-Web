const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { NoFieldsController } = require("../../../controllers/fields");

module.exports = class NoFieldsViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controllerClass = NoFieldsController;
};
