const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { NotReadOnlyController } = require("../../../controllers/read_only");

module.exports = class NotReadOnlyViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controllerClass = NotReadOnlyController;
};
