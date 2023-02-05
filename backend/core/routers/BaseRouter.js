const { Router } = require("express");

module.exports = class BaseRouter {
  viewset = null;

  constructor(path, viewset) {
    this.path = path.slice(-1) === "/" ? path : `${path}/`;
    this.viewset = viewset;
    this.router = this.getRoutes();
  }

  getRoutes() {
    let router = Router();
    router.get(this.path, this.viewset.list_middleware);
    router.get(`${this.path}:id/`, this.viewset.retrieve_middleware);
    router.post(this.path, this.viewset.create_middleware);
    router.patch(`${this.path}:id/`, this.viewset.update_middleware);
    router.delete(`${this.path}:id/`, this.viewset.destroy_middleware);
    return router;
  }
};
