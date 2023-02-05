const { OkResponse, NoContentResponse } = require("../responses");

// TODO split non-model functions out into a separate class, ApiView, and have ModelApiView extend it
// TODO some of this functionality should be concentrated in the controller and fields
module.exports = class ModelApiView {
  lookup_field = "id";
  model = null;
  controller_class = null;

  get_controller_context(req) {
    return {
      partial: req.method === "PATCH",
    };
  }

  get_controller_context_middleware(req, _, next) {
    req.controller_context = get_controller_context(req);
    next()
  }

  async create_object(data) {
    return await this.model.create(data);
  }

  async create_object_middleware(req, _, next) {
    try {
      req.instance = await this.create_object(req.internal_value);
      next();
    } catch (e) {
      next(e);
    }
  }

  async update_object(instance, data) {
    return await instance.update(data);
  }

  async update_object_middleware(req, _, next) {
    try {
      await this.update_object(req.instance, req.internal_value);
      next();
    } catch (e) {
      next(e);
    }
  }

  serializer_middleware(req, _, next) {
    try {
      controller = this.get_controller(
        req.instance,
        req.body,
        req.controller_context.partial
      );
      if (controller.is_valid((raiseError = true))) {
        req.internal_value = controller.to_internal_value(req.body);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  async list_objects() {
    return await this.model.findAll();
  }

  async list_objects_middleware(req, _, next) {
    try {
      req.instances = await this.list_objects();
      next();
    } catch (e) {
      next(e);
    }
  }

  async perform_destroy(instance) {
    await instance.destroy();
  }

  async destroy_object_middleware(req, res, next) {
    try {
      await this.perform_destroy(req.instance);
      return new NoContentResponse().send(res);
    } catch (e) {
      next(e);
    }
  }

  deserialize_middleware(req, res, next) {
    try {
      let controller = this.get_controller();
      let data = req.instance ? req.instance : req.instances;
      data = controller.to_representation(data);
      // TODO This works for retrieve, list, update, but not for create, should return 201 for create
      return new OkResponse(data).sendJson(res);
    } catch (e) {
      next(e);
    }
  }

  async get_object_middleware(req, _, next) {
    try {
      instance = await this.get_object(req.params.id, this.lookup_field === "id");
      req.instance = instance;
      next();
    } catch (e) {
      // TODO get object or 404
      next(e);
    }
  }

  async get_object(urlValue, findById = true) {
    if (findById) {
      return await this.model.findByPk(urlValue);
    } else {
      return await this.model.findOne({ where: { [this.lookup_field]: urlValue } });
    }
  }

  get_controller(...args) {
    return new (this.get_controller_class())(...args);
  }

  get_controller_class() {
    return this.controller_class;
  }
};
