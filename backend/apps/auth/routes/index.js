const { Router } = require("express");
const authRouter = Router();

const userView = require("../views/userView");

// TODO move into separate files
authRouter.get("/user/", userView.list);
authRouter.post("/user/", userView.create);
authRouter.get("/user/:id/", userView.get);
authRouter.patch("/user/:id/", userView.update);
authRouter.delete("/user/:id/", userView.destroy);

module.exports = authRouter;
