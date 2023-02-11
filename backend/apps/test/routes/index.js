const { BaseRouter } = require("../../../core/routers");
const { StringViewSet, IntegerViewSet } = require("../views");
const { Router } = require("express");

let testRouter = Router();

let stringRouter = new BaseRouter("/string", new StringViewSet());
let intRouter = new BaseRouter("/int", new IntegerViewSet());

testRouter.use("/", stringRouter.router);
testRouter.use("/", intRouter.router);

module.exports = testRouter;
