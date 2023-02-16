const { ForbiddenError } = require("../responses/errors");
const Router = require("express").Router;

module.exports = class ApiView {
  /**
   * Class based route collection, that can be used to create a router.
   * Instance attributes can be defined either as methods or lists of methods
   * which will be used as route handlers.
   *
   * Instance attribute names can be HTTP methods, e.g., get, post, put, delete, patch.
   * In this case they will automatically be bound as route handlers to the router at the root path.
   *
   * Instance attribute names can also be any arbitraty name, and then when calling as_router, a
   * mapping of HTTP methods to attribute names must be provided.
   */
  asRouter(methodMap) {
    /**
     * methodMap in format
     * {
     *  get: {handler: <method_name>, route: <route>},
     *  // OR can be a list of routes for each method, e.g.,
     *  post: [
     *    {handler: <method_name>, route: <route>},
     *    {handler: <method_name>, route: <route>},
     *  ]
     *
     * }
     */
    let router = Router();

    const defaultMethodMap = {
      get: { handler: "get", route: "/" },
      post: { handler: "post", route: "/" },
      put: { handler: "put", route: "/" },
      delete: { handler: "delete", route: "/" },
      patch: { handler: "patch", route: "/" },
      put: { handler: "put", route: "/" },
    };

    methodMap =
      methodMap === undefined
        ? defaultMethodMap
        : { ...defaultMethodMap, ...methodMap };

    for (const method in methodMap) {
      if (!Array.isArray(methodMap[method]))
        methodMap[method] = [methodMap[method]];
      for (let { handler, route } of methodMap[method]) {
        route = route === undefined ? "/" : route;
        if (!this.hasOwnProperty(handler)) continue;
        router[method](route, this.insertMiddleware(this[handler]));
      }
    }
    return router;
  }

  preRouteMiddleware = [this.checkPermissions.bind(this)];
  postRouteMiddleware = [];

  insertMiddleware(routeHandlers) {
    if (!Array.isArray(routeHandlers)) routeHandlers = [routeHandlers];

    routeHandlers = [
      ...this.preRouteMiddleware,
      ...routeHandlers,
      ...this.postRouteMiddleware,
    ];

    return routeHandlers;
  }

  checkPermissions(req, res, next) {
    if (!this.permissions) return next();
    for (let permission of this.permissions) {
      if (!permission.hasPermission(req)) return new ForbiddenError().send(res);
      return next();
    }
  }
};
