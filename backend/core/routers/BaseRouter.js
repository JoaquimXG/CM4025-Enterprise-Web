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
    router.get(this.path, this.viewset.list);
    router.get(`${this.path}:id/`, this.viewset.retrieve);
    router.post(this.path, this.viewset.create);
    router.patch(`${this.path}:id/`, this.viewset.update);
    router.delete(`${this.path}:id/`, this.viewset.destroy);
    // TODO(LOW) replace requires implementing non-partial update first
    // router.put(`${this.path}:id/`, this.viewset.update); // Uses the same middleware as patch, but when getting controller context, partial is set to false
    return router;
  }
};
