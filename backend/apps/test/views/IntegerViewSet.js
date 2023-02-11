const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { IntegerController } = require("../controllers");

module.exports = class IntegerViewSet extends ModelViewSet {
  model = sequelize.models.IntegerModel;
  controller_class = IntegerController;
};
