const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { NotExcludeController } = require("../../../controllers/exclude");

module.exports = class NotExcludeViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controller_class = NotExcludeController;
};
