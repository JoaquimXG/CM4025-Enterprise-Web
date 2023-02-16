const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { BooleanController } = require("../controllers");

module.exports = class BooleanViewSet extends ModelViewSet {
  model = sequelize.models.BooleanModel;
  controllerClass = BooleanController;
};
