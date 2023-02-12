const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { PartialFieldsController } = require("../../../controllers/fields");

module.exports = class PartialFieldsViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controller_class = PartialFieldsController;
};
