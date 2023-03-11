const ApiView = require("./ApiView");
const {
  OkResponse,
  NoContentResponse,
  CreatedResponse,
} = require("../responses");
const { NotFoundError } = require("../responses/errors");
const { Op } = require("sequelize");

const sequelize = require("../db/sequelize");

module.exports = class ModelApiView extends ApiView {
  lookupField = "id";
  model = null;
  controllerClass = null;
  // Filters
  queryFilter = null;
  accessPolicy = null;
  filters = null;

  getQueryFilter(req) {
    // Probably wont' be used for this project
    if (!this.queryFilter) {
      return null;
    }
    return this.queryFilter.getFilter(req);
  }

  getAccessPolicyFilter(req) {
    if (!this.accessPolicy) {
      return null;
    }
    return new this.accessPolicy(this.model).getFilter(req);
  }

  getFilter(req) {
    /**
     * Collect all the filters for this view.
     *
     * where clause filters will be additively applied using Op.and.
     * Other clauses, e.g., "include", "having", etc., will be merged
     *
     * Filters are collected from three sources, access policy filters, query filters
     * and a filters property on the view.
     *
     * Access policy filters and query filters are generated via function taking the current request
     * as parameter, allowing for request based filtering, e.g., filtering by current user, or
     * by query parameters.
     *
     * The filters property is a static filter object, which is applied to all requests.
     */
    let filters = [
      this.getAccessPolicyFilter(req),
      this.getQueryFilter(req),
      this.filters ? this.filters : null,
    ];

    //Remove all null values from filters
    filters = filters.filter((f) => f !== null);
    // If no values remain return empty filter object
    if (filters.length === 0) return {};

    // Otherwise, combine all filters into a single filter object
    let filter = {};
    for (let f of filters) {
      for (let key in f) {
        if (key === "where") {
          if (!("where" in filter)) filter["where"] = { [Op.and]: [] };
          filter["where"][Op.and].push(f["where"]);
        } else {
          if (!(key in filter)) filter[key] = [];
          filter[key].push(f[key]);
        }
      }
    }

    return filter;
  }

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

  async listObjects(req) {
    let filter = this.getFilter(req);
    return await this.model.findAll(filter);
  }

  async listObjectsMiddleware(req, _, next) {
    try {
      req.instances = await this.listObjects(req);
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
