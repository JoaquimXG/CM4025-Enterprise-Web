const { BaseRouter } = require("../../../core/routers");
const { Router } = require("express");
const { UserViewSet } = require("../views");

const authRouter = Router();

let userRouter = new BaseRouter("/user", new UserViewSet());
authRouter.use("/", userRouter.router);

module.exports = authRouter;
