const { OkResponse, NoContentResponse } = require("../responses");

module.exports = class BaseApiView {
  static lookup_field = "id";
  static model = null;
  static controller_class = null;

  static get_controller_context(req) {
    return {
      partial: req.method === "PATCH",
    };
  }

  static get_controller_context_middleware(req, _, next) {
    req.controller_context = get_controller_context(req);
    next()
  }

  static create_object(data) {
    return this.model.create(data);
  }

  static create_object_middleware(req, _, next) {
    try {
      req.instance = this.create_object(req.internal_value);
      next();
    } catch (e) {
      next(e);
    }
  }

  static update_object(instance, data) {
    return instance.update(data);
  }

  static update_object_middleware(req, _, next) {
    try {
      this.update_object(req.instance, req.internal_value);
      req.instance.update(req.internal_value);
      next();
    } catch (e) {
      next(e);
    }
  }

  static serializer_middleware(req, _, next) {
    try {
      controller = this.get_controller(
        req.instance,
        req.body,
        req.controller_context.partial
      );
      if (controller.is_valid((raiseException = true))) {
        req.internal_value = controller.to_internal_value(req.body);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  static list_objects() {
    return this.model.findAll();
  }

  static list_objects_middleware(req, _, next) {
    try {
      req.instances = this.list_objects();
      next();
    } catch (e) {
      next(e);
    }
  }

  static perform_destroy(instance) {
    instance.destroy();
  }

  static destroy_object_middleware(req, res, next) {
    try {
      this.perform_destroy(req.instance);
      return new NoContentResponse().send(res);
    } catch (e) {
      next(e);
    }
  }

  static deserialize_middleware(req, res, next) {
    try {
      controller = this.get_controller();
      data = req.instance ? req.instance : req.instances;
      data = controller.to_representation(data);
      // TODO This works for retrieve, list, update, but not for create, should return 201 for create
      return new OkResponse(data).sendJson(res);
    } catch (e) {
      next(e);
    }
  }

  static get_object_middleware(req, _, next) {
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
