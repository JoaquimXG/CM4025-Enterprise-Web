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
  lookupField = "id";
  model = null;
  controllerClass = null;

  getControllerContext(req) {
    return {
      partial: req.method === "PATCH",
      create: req.method === "POST",
      req: req,
    };
  }

  getControllerContextMiddleware(req, _, next) {
    req.controllerContext = this.getControllerContext(req);
    return next();
  }

  async createObject(controller) {
    return await controller.create(controller.validatedData);
  }

  async createObjectMiddleware(req, _, next) {
    try {
      req.instance = await this.createObject(req.controller);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async updateObject(controller) {
    return await controller.update(
      controller.instance,
      controller.validatedData
    );
  }

  async updateObjectMiddleware(req, _, next) {
    try {
      await this.updateObject(req.controller);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async serializerMiddleware(req, _, next) {
    try {
      req.controller = this.getController({
        instance: req.instance || null,
        data: req.body,
        partial: req.controllerContext.partial,
        context: req.controllerContext,
      });
      if (await req.controller.isValid(true)) next();
    } catch (e) {
      return next(e);
    }
  }

  async listObjects() {
    return await this.model.findAll(); // TODO should optimise related queries here, e.g., to avoid n+1 queries
  }

  async listObjectsMiddleware(req, _, next) {
    try {
      req.instances = await this.listObjects();
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async performDestroy(instance) {
    await instance.destroy();
  }

  async destroyObjectMiddleware(req, res, next) {
    try {
      await this.performDestroy(req.instance);
      return new NoContentResponse().send(res);
    } catch (e) {
      return next(e);
    }
  }

  async deserializeMiddleware(req, res, next) {
    try {
      let many = req.instances ? true : false;
      let data = req.instance ? req.instance : req.instances;
      let controller = this.getController({ many });
      data = await controller.toRepresentation(data);
      if (req.controllerContext.create)
        return new CreatedResponse(data).sendJson(res);
      else return new OkResponse(data).sendJson(res);
    } catch (e) {
      return next(e);
    }
  }

  async getObjectMiddleware(req, res, next) {
    try {
      req.instance = await this.getObject(
        req.params.id,
        this.lookupField === "id"
      );
      if (!req.instance) return new NotFoundError().send(res);
      return next();
    } catch (e) {
      return next(e);
    }
  }

  async getObject(urlValue, findById = true) {
    if (findById) {
      return await this.model.findByPk(urlValue);
    } else {
      return await this.model.findOne({
        where: { [this.lookupField]: urlValue },
      });
    }
  }

  getController(...args) {
    return new (this.getControllerClass())(...args);
  }

  getControllerClass() {
    return this.controllerClass;
  }
};
