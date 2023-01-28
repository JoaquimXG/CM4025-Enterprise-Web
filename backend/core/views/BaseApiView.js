const { OkResponse, NoContentResponse } = require("../responses");

module.exports = class BaseApiView {
  static lookup_field = "id";
  static model = null;
  static controller_class = null;

  static destroy_object_middleware(req, res, next) {
    try {
      req.instance.destroy();
      return new NoContentResponse().send(res);
    } catch (e) {
      next(e);
    }
  }

  static deserialize_middleware(req, res, next) {
    controller = this.get_controller();
    try {
      data = controller.to_representation(req.instance);
      // TODO This works for retrieve, list, update, but not for create, should return 201 for create
      return new OkResponse(data).sendJson(res);
    } catch (e) {
      next(e);
    }
  }

  static get_object_middleware(req, res, next) {
    try {
      instance = this.get_object(req.params.id, this.lookup_field === "id");
      req.instance = instance;
      next();
    } catch (e) {
      // TODO get object or 404
      next(e);
    }
  }

  static get_object(urlValue, findById = true) {
    if (findById) {
      return this.model.findByPk(urlValue);
    } else {
      return this.model.findOne({ where: { [this.lookup_field]: urlValue } });
    }
  }

  static get_controller() {
    return this.get_controller_class()();
  }

  static get_controller_class() {
    return this.controller_class;
  }
};
