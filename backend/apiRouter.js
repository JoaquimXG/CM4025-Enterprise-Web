const {Router} = require("express")

apiRouter = Router()

routers = [
  ["/auth", require("./apps/auth/routes")]
]

for (const [route, router] of routers) {
  apiRouter.use(route, router);
}

module.exports = apiRouter