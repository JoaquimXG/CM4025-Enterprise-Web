const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { NullDefaultController } = require("../controllers");

module.exports = class NullDefaultViewSet extends ModelViewSet {
  model = sequelize.models.NullDefaultModel;
  controllerClass = NullDefaultController;
};
