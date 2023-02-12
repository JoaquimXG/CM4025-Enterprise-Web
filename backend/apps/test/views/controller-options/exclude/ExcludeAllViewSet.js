const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { ExcludeAllController } = require("../../../controllers/exclude");

module.exports = class ExcludeAllViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controller_class = ExcludeAllController;
};
