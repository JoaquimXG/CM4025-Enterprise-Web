const AdminUserViewSet = require("./AdminUserViewSet");
const UserViewSet = require("./UserViewSet");
const LoginView = require("./LoginView")
const IsAdminView = require("./IsAdminView")
const IsAuthenticatedView = require("./IsAuthenticatedView")
const LogoutView = require("./LogoutView")

module.exports = {
  AdminUserViewSet,
  UserViewSet,
  LoginView,
  IsAdminView,
  IsAuthenticatedView,
  LogoutView,
}