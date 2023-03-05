const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { RegisterController } = require("../controllers");
const { NoContentResponse } = require("../../../core/responses/");

module.exports = class RegisterView extends ModelViewSet {
  model = sequelize.models.User;
  controllerClass = RegisterController;

  loginMiddleware(req, res, next) {
    req.login(req.instance, (err) => {
      if (err) return next(err);
      return new NoContentResponse().send(res);
    });
  }

  create = [
    this.getControllerContextMiddleware.bind(this),
    this.serializerMiddleware.bind(this),
    this.createObjectMiddleware.bind(this),
    this.loginMiddleware.bind(this),
    this.deserializeMiddleware.bind(this),
  ];

  retrieve = this.notAllowed;
  list = this.notAllowed;
  update = this.notAllowed;
  delete = this.notAllowed;
};
