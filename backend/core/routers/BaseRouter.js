const { Router } = require("express");

module.exports = class BaseRouter {
  viewset = null;
  router = null;

  constructor(path, viewset) {
    this.path = path;
    this.viewset = viewset;
    this.router = this.getRoutes();
  }

  getRoutes() {
    router = Router();
    this.router.get(path, viewset.list_middleware);
    this.router.get(`${path}/:id/`, viewset.retrieve_middleware);
    this.router.post(path, viewset.create_middleware);
    this.router.patch(`${path}/:id/`, viewset.update_middleware);
    this.router.delete(`${path}/:id/`, viewset.destroy_middleware);
    return router;
  }
};
