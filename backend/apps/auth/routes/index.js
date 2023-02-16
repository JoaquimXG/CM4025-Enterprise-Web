const { BaseRouter } = require("../../../core/routers");
const { Router } = require("express");
const {
  UserViewSet,
  LoginView,
  IsAdminView,
  IsAuthenticatedView,
  LogoutView,
} = require("../views");

const authRouter = Router();

//TODO override /user/:id/ for /user/me/ to show the currently loggeded in user's details
authRouter.get("/user/me", (req,res) => res.send("test"))
let userRouter = new BaseRouter("/user", new UserViewSet());
authRouter.use("/", userRouter.router);
authRouter.use("/login", new LoginView().as_router());
authRouter.use("/isadmin", new IsAdminView().as_router());
authRouter.use("/isauthenticated", new IsAuthenticatedView().as_router());
authRouter.use("/logout", new LogoutView().as_router());

module.exports = authRouter;
