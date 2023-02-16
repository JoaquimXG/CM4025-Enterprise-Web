const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { StringController } = require("../controllers");

module.exports = class StringViewSet extends ModelViewSet {
  model = sequelize.models.StringModel;
  controllerClass = StringController;
};
