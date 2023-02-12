const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { PartialReadOnlyController } = require("../../../controllers/read_only");

module.exports = class PartialReadOnlyViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controller_class = PartialReadOnlyController;
};
