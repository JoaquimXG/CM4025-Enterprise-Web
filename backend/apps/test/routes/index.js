const {
  StringViewSet,
  IntegerViewSet,
  BooleanViewSet,
  NullDefaultViewSet,
  ChoiceViewSet,
  DateTimeViewSet,
  EmailViewSet,
} = require("../views");
const controllerOptionsRouter = require("./controller-options");
const { Router } = require("express");

let testRouter = Router();

testRouter.use("/string", new StringViewSet().asRouter());
testRouter.use("/int", new IntegerViewSet().asRouter());
testRouter.use("/bool", new BooleanViewSet().asRouter());
testRouter.use("/nullDefault", new NullDefaultViewSet().asRouter());
testRouter.use("/choice", new ChoiceViewSet().asRouter());
testRouter.use("/dateTime", new DateTimeViewSet().asRouter());
testRouter.use("/email", new EmailViewSet().asRouter());
testRouter.use("/controllerOptions/", controllerOptionsRouter);

module.exports = testRouter;
