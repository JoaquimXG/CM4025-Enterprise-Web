const { BaseRouter } = require("../../../core/routers");
const {
  StringViewSet,
  IntegerViewSet,
  BooleanViewSet,
  NullDefaultViewSet,
  ChoiceViewSet,
  DateTimeViewSet,
  EmailViewSet,
} = require("../views");
const controllerOptionsRouter = require("./controller-options")
const { Router } = require("express");

let testRouter = Router();

let stringRouter = new BaseRouter("/string", new StringViewSet());
let intRouter = new BaseRouter("/int", new IntegerViewSet());
let boolRouter = new BaseRouter("/bool", new BooleanViewSet());
let nullDefaultRouter = new BaseRouter(
  "/nullDefault",
  new NullDefaultViewSet()
);
let choiceRouter = new BaseRouter("/choice", new ChoiceViewSet());
let dateTimeRouter = new BaseRouter("/dateTime", new DateTimeViewSet());
let emailRouter = new BaseRouter("/email", new EmailViewSet());

testRouter.use("/", stringRouter.router);
testRouter.use("/", intRouter.router);
testRouter.use("/", boolRouter.router);
testRouter.use("/", nullDefaultRouter.router);
testRouter.use("/", choiceRouter.router);
testRouter.use("/", dateTimeRouter.router)
testRouter.use("/", emailRouter.router)
testRouter.use("/controllerOptions/", controllerOptionsRouter)

module.exports = testRouter;
