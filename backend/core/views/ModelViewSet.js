const ModelApiView = require("./ModelApiView");

module.exports = class ModelViewSet extends ModelApiView {
  create_middleware = [
    this.get_controller_context_middleware.bind(this),
    this.serializer_middleware.bind(this),
    this.create_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  update_middleware = [
    this.get_controller_context_middleware.bind(this),
    this.get_object_middleware.bind(this),
    this.serializer_middleware.bind(this),
    this.update_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  retrieve_middleware = [
    this.get_controller_context_middleware.bind(this),
    this.get_object_middleware.bind(this),
    this.deserialize_middleware.bind(this),
  ];

  list_middleware = [
    this.get_controller_context_middleware.bind(this),
    this.list_objects_middleware.bind(this),
    // TODO(LOW) Add filter and pagination middleware
    // this.filter_objects_middleware,
    // this.paginate_objects_middleware,
    this.deserialize_middleware.bind(this),
  ];

  destroy_middleware = [
    this.get_object_middleware.bind(this),
    this.destroy_object_middleware.bind(this),
  ];
};
