const { BaseRouter } = require("../../../core/routers");
const { Router } = require("express");
const { UserViewSet } = require("../views");

// TODO(IMPORTANT) DELETE OLD USER VIEWS AND MIGRATE TO NEW RESTFUL BASED MODEL VIEWS
// const userView = require("../views/userView");
// authRouter.get("/user/", userView.list);
// authRouter.post("/user/", userView.create);
// authRouter.get("/user/:id/", userView.get);
// authRouter.patch("/user/:id/", userView.update);
// authRouter.delete("/user/:id/", userView.destroy);

const authRouter = Router();

let userRouter = new BaseRouter("/user", new UserViewSet());
authRouter.use("/", userRouter.router);

module.exports = authRouter;
