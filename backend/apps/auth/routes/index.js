const { Router } = require("express");
const {
  AdminUserViewSet,
  UserViewSet,
  LoginView,
  IsAdminView,
  IsAuthenticatedView,
  LogoutView,
} = require("../views");

const authRouter = Router();

authRouter.use(
  "/user/me",
  new UserViewSet().asRouter({
    get: { handler: "retrieve", route: "/" },
    patch: { handler: "update", route: "/" },
  })
);
// authRouter.use("/user/", new AdminUserViewSet().asRouter());
authRouter.use("/login", new LoginView().asRouter());
authRouter.use("/isadmin", new IsAdminView().asRouter());
authRouter.use("/isauthenticated", new IsAuthenticatedView().asRouter());
authRouter.use("/logout", new LogoutView().asRouter());

module.exports = authRouter;
