const ModelApiView = require("./ModelApiView");

module.exports = class ModelViewSet extends ModelApiView {
  create = [
    this.getControllerContextMiddleware.bind(this),
    this.serializerMiddleware.bind(this),
    this.createObjectMiddleware.bind(this),
    this.deserializeMiddleware.bind(this),
  ];

  update = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.serializerMiddleware.bind(this),
    this.updateObjectMiddleware.bind(this),
    this.deserializeMiddleware.bind(this),
  ];

  retrieve = [
    this.getControllerContextMiddleware.bind(this),
    this.getObjectMiddleware.bind(this),
    this.deserializeMiddleware.bind(this),
  ];

  list = [
    this.getControllerContextMiddleware.bind(this),
    this.listObjectsMiddleware.bind(this),
    // TODO(LOW) Add filter and pagination middleware
    // this.filterObjectsMiddleware,
    // this.paginateObjectsMiddleware,
    this.deserializeMiddleware.bind(this),
  ];

  destroy = [
    this.getObjectMiddleware.bind(this),
    this.destroyObjectMiddleware.bind(this),
  ];

  asRouter(actionMap) {
    let methodMap = {
      get: [
        { handler: "list", route: "/" },
        { handler: "retrieve", route: "/:id/" },
      ],
      post: { handler: "create", route: "/" },
      patch: { handler: "update", route: "/:id/" },
      delete: { handler: "destroy", route: "/:id/" },
      ...actionMap,
    };

    return super.asRouter(methodMap);
  }
};
