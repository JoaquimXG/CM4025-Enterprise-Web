const { MethodNotAllowedError } = require("../responses/errors");
const ModelApiView = require("./ModelApiView");
const _ = require("lodash");

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

  notAllowed = (_, res, __) => new MethodNotAllowedError().send(res);

  mergeActionMap(actionMap, baseActionMap) {
    const subObjectToArrays = (obj) => {
      return _.mapValues(obj, (value) => {
        if (_.isPlainObject(value)) {
          return [value];
        }
        return value;
      });
    };
    actionMap = subObjectToArrays(actionMap);
    baseActionMap = subObjectToArrays(baseActionMap);

    return _.mergeWith(baseActionMap, actionMap, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });
  }

  asRouter(actionMap = {}, override = false) {
    let baseActionMap = {
      get: [
        { handler: "list", route: "/" },
        { handler: "retrieve", route: "/:id/" },
      ],
      post: { handler: "create", route: "/" },
      patch: { handler: "update", route: "/:id/" },
      delete: { handler: "destroy", route: "/:id/" },
    };

    // Merge actionMap with baseActionMap if not overriding base actions
    if (!override){
      actionMap = this.mergeActionMap(actionMap, baseActionMap);
    }

    return super.asRouter(actionMap);
  }
};
