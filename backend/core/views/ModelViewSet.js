const ModelApiView = require("./ModelApiView");

module.exports = class ModelViewSet extends ModelApiView {
  create = [
    this.get_controller_context_middleware.bind(this),
    this.serializer_middleware.bind(this),
    this.create_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  update = [
    this.get_controller_context_middleware.bind(this),
    this.get_object_middleware.bind(this),
    this.serializer_middleware.bind(this),
    this.update_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  retrieve = [
    this.get_controller_context_middleware.bind(this),
    this.get_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  list = [
    this.get_controller_context_middleware.bind(this),
    this.list_objects_middleware.bind(this),
    // TODO(LOW) Add filter and pagination middleware
    // this.filter_objects_middleware,
    // this.paginate_objects_middleware,
    this.deserialize_middleware.bind(this),
  ];

  destroy = [
    this.get_object_middleware.bind(this),
    this.destroy_object_middleware.bind(this),
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
