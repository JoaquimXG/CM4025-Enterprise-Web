const { Router } = require("express");

let apiRouter = Router();

let routers = [
  ["/auth/", require("./apps/auth/routes")],
  ["/test/", require("./apps/test/routes")],
];

for (const [route, router] of routers) {
  apiRouter.use(route, router);
}

module.exports = apiRouter;
