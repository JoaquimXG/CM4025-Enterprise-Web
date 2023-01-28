const BaseApiView = require("./BaseApiView");

module.exports = class ApiView extends BaseApiView {
  static create_middleware = [
    this.serializer_middleware,
    this.create_object_middleware,
    this.deserialize_middleware,
  ];

  static update_middleware = [
    this.get_controller_context_middleware,
    this.get_object_middleware,
    this.serializer_middleware,
    this.update_object_middleware,
    this.deserialize_middleware,
  ];

  static retrieve_middleware = [
    this.get_object_middleware,
    this.deserialize_middleware,
  ];

  static list_middleware = [
    this.list_objects_middleware,
    // TODO
    // this.filter_objects_middleware,
    // this.paginate_objects_middleware,
    this.deserialize_middleware,
  ];

  static destroy_middleware = [
    this.get_object_middleware,
    this.destroy_object_middleware,
  ];
};
