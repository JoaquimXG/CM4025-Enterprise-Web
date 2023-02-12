const { Router } = require("express");
const settings = require("./core/settings");

let apiRouter = Router();

let routers = [["/auth/", require("./apps/auth/routes")]];

if (settings.INIT_TESTS) {
  routers = routers.concat([["/test/", require("./apps/test/routes")]]);
}

for (const [route, router] of routers) {
  apiRouter.use(route, router);
}

module.exports = apiRouter;
