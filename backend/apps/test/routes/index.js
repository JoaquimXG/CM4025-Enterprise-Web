const { BaseRouter } = require("../../../core/routers");
const { TestViewSet } = require("../views");
const { Router } = require("express");

quoteRouter = Router();

let testRouter = new BaseRouter("/test", new TestViewSet());
quoteRouter.use("/", testRouter.router);

module.exports = quoteRouter;
