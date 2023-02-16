const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { EmailController } = require("../controllers");

module.exports = class EmailViewSet extends ModelViewSet {
  model = sequelize.models.EmailModel;
  controllerClass = EmailController;
};
