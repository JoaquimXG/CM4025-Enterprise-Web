const { BaseRouter } = require("../../../core/routers");
const { StringViewSet, IntegerViewSet, BooleanViewSet } = require("../views");
const { Router } = require("express");

let testRouter = Router();

let stringRouter = new BaseRouter("/string", new StringViewSet());
let intRouter = new BaseRouter("/int", new IntegerViewSet());
let boolRouter = new BaseRouter("/bool", new BooleanViewSet());

testRouter.use("/", stringRouter.router);
testRouter.use("/", intRouter.router);
testRouter.use("/", boolRouter.router);

module.exports = testRouter;
