const { Router } = require("express");

let apiRouter = Router();

let routers = [
  ["/auth/", require("./apps/auth/routes")],
  ["/quote/", require("./apps/quoteBuilder/routes")],
];

for (const [route, router] of routers) {
  apiRouter.use(route, router);
}

module.exports = apiRouter;
