const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { RegisterController } = require("../controllers");

module.exports = class RegisterView extends ModelViewSet {
  model = sequelize.models.User;
  controllerClass = RegisterController;

  retrieve = this.notAllowed;
  list = this.notAllowed;
  update = this.notAllowed;
  delete = this.notAllowed;
};
