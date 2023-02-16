const ApiView = require("./ApiView");
const {
  OkResponse,
  NoContentResponse,
  CreatedResponse,
} = require("../responses");
const { NotFoundError } = require("../responses/errors");

// DRF split non-model functions out into a separate class, ApiView, and have ModelApiView extend it
// DRF some of this functionality should be concentrated in the controller and fields
module.exports = class ModelApiView extends ApiView {
  lookup_field = "id";
  model = null;
  controller_class = null;

  get_controller_context(req) {
    return {
      partial: req.method === "PATCH",
      create: req.method === "POST",
    };
  }

  get_controller_context_middleware(req, _, next) {
    req.controller_context = this.get_controller_context(req);
    return next();
  }

  async create_object(controller) {
    return await controller.create(controller.validated_data);
  }

  async create_object_middleware(req, _, next) {
    try {
      req.instance = await this.create_object(req.controller);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async update_object(controller) {
    return await controller.update(
      controller.instance,
      controller.validated_data
    );
  }

  async update_object_middleware(req, _, next) {
    try {
      await this.update_object(req.controller);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  serializer_middleware(req, _, next) {
    try {
      req.controller = this.get_controller({
        instance: req.instance || null,
        data: req.body,
        options: { partial: req.controller_context.partial },
      });
      if (req.controller.is_valid(true)) next();
    } catch (e) {
      return next(e);
    }
  }

  async list_objects() {
    return await this.model.findAll();
  }

  async list_objects_middleware(req, _, next) {
    try {
      req.instances = await this.list_objects();
      return next();
    } catch (e) {
      return next(e);
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
      return next(e);
    }
  }

  deserialize_middleware(req, res, next) {
    try {
      let many = req.instances ? true : false;
      let data = req.instance ? req.instance : req.instances;
      let controller = this.get_controller({ options: { many } });
      data = controller.to_representation(data);
      if (req.controller_context.create)
        return new CreatedResponse(data).sendJson(res);
      else return new OkResponse(data).sendJson(res);
    } catch (e) {
      return next(e);
    }
  }

  async get_object_middleware(req, res, next) {
    try {
      req.instance = await this.get_object(
        req.params.id,
        this.lookup_field === "id"
      );
      if (!req.instance) return new NotFoundError().send(res);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async get_object(urlValue, findById = true) {
    if (findById) {
      return await this.model.findByPk(urlValue);
    } else {
      return await this.model.findOne({
        where: { [this.lookup_field]: urlValue },
      });
    }
  }

  get_controller(...args) {
    return new (this.get_controller_class())(...args);
  }

  get_controller_class() {
    return this.controller_class;
  }
};
