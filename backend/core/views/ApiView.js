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
  as_router(methodMap) {
    /**
     * methodMap in format
     * {
     *  get: "method_name/list_of_methods",
     *  post: "method_name/list_of_methods",
     *  ...
     * }
     */
    let router = Router();

    // Try to bind all standard methods
    for (let method of ["get", "post", "put", "delete", "patch"]) {
      if (this[method]) {
        router[method]("/", this[method]);
      }
      if (methodMap && methodMap[method]) delete methodMap[method];
    }

    for (const method in methodMap) {
      if (!this.hasOwnProperty(methodMap[method]))
        throw new Error(
          `Method ${methodMap[method]} does not exist on ${this.constructor.name}`
        );
      router[method](this[methodMap[method]]);
    }
    return router;
  }
};
