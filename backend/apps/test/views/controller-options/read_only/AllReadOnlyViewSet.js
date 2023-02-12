const { ModelViewSet } = require("../../../../../core/views");
const sequelize = require("../../../../../core/db/sequelize");
const { AllReadOnlyController } = require("../../../controllers/read_only");

module.exports = class AllReadOnlyViewSet extends ModelViewSet {
  model = sequelize.models.ReadOnlyDefaultModel;
  controller_class = AllReadOnlyController;
};
