const { Router } = require("express");

const {
  AllFieldsViewSet,
  PartialFieldsViewSet,
  NoFieldsViewSet,
} = require("../../views/controller-options/fields");

let fieldsRouter = Router();

fieldsRouter.use("/all", new AllFieldsViewSet().asRouter());
fieldsRouter.use("/partial", new PartialFieldsViewSet().asRouter());
fieldsRouter.use("/no", new NoFieldsViewSet().asRouter());

const {
  ExcludeAllViewSet,
  PartialExcludeViewSet,
  NotExcludeViewSet,
} = require("../../views/controller-options/exclude");

let excludeRouter = Router();

excludeRouter.use("/all", new ExcludeAllViewSet().asRouter());
excludeRouter.use("/partial", new PartialExcludeViewSet().asRouter());
excludeRouter.use("/no", new NotExcludeViewSet().asRouter());

const {
  AllReadOnlyViewSet,
  PartialReadOnlyViewSet,
  NotReadOnlyViewSet,
} = require("../../views/controller-options/read_only");

let readOnlyRouter = Router();

readOnlyRouter.use("/all", new AllReadOnlyViewSet().asRouter());
readOnlyRouter.use("/partial", new PartialReadOnlyViewSet().asRouter());
readOnlyRouter.use("/no", new NotReadOnlyViewSet().asRouter());

let router = Router();
router.use("/fields", fieldsRouter);
router.use("/exclude", excludeRouter);
router.use("/read_only", readOnlyRouter);

module.exports = router;
