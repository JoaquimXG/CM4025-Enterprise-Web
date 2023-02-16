const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { ChoiceController } = require("../controllers");

module.exports = class ChoiceViewSet extends ModelViewSet {
  model = sequelize.models.ChoiceModel;
  controllerClass = ChoiceController;
};
