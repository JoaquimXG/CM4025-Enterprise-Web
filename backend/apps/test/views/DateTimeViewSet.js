const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { DateTimeController } = require("../controllers");

module.exports = class DateTimeViewSet extends ModelViewSet {
  model = sequelize.models.DateTimeModel;
  controllerClass = DateTimeController;
};
