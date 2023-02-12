const { BaseRouter } = require("../../../../core/routers");
const { Router } = require("express");

let fieldsRouter = Router();
const {
  AllFieldsViewSet,
  PartialFieldsViewSet,
  NoFieldsViewSet,
} = require("../../views/controller-options/fields");

let allRouter = new BaseRouter("/all", new AllFieldsViewSet());
let partialRouter = new BaseRouter("/partial", new PartialFieldsViewSet());
let noRouter = new BaseRouter("/no", new NoFieldsViewSet());

fieldsRouter.use("/", allRouter.router);
fieldsRouter.use("/", partialRouter.router);
fieldsRouter.use("/", noRouter.router);

const {
  ExcludeAllViewSet,
  PartialExcludeViewSet,
  NotExcludeViewSet,
} = require("../../views/controller-options/exclude");

let excludeRouter = Router();
let excludeAllRouter = new BaseRouter("/all", new ExcludeAllViewSet());
let partialExcludeRouter = new BaseRouter(
  "/partial",
  new PartialExcludeViewSet()
);
let notExcludeRouter = new BaseRouter("/no", new NotExcludeViewSet());

excludeRouter.use("/", excludeAllRouter.router);
excludeRouter.use("/", partialExcludeRouter.router);
excludeRouter.use("/", notExcludeRouter.router);

const {
  AllReadOnlyViewSet,
  PartialReadOnlyViewSet,
  NotReadOnlyViewSet,
} = require("../../views/controller-options/read_only");

let readOnlyRouter = Router();
let allReadOnlyRouter = new BaseRouter("/all", new AllReadOnlyViewSet());
let partialReadOnlyRouter = new BaseRouter(
  "/partial",
  new PartialReadOnlyViewSet()
);
let notReadOnlyRouter = new BaseRouter("/no", new NotReadOnlyViewSet());

readOnlyRouter.use("/", allReadOnlyRouter.router);
readOnlyRouter.use("/", partialReadOnlyRouter.router);
readOnlyRouter.use("/", notReadOnlyRouter.router);

let router = Router();
router.use("/fields", fieldsRouter);
router.use("/exclude", excludeRouter);
router.use("/read_only", readOnlyRouter);

module.exports = router;
