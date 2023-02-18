const { Router } = require("express");
const { ProjectViewSet, QuoteViewSet } = require("../views");

const quoteBuilderRouter = Router();

quoteBuilderRouter.use("/project", new ProjectViewSet().asRouter());
quoteBuilderRouter.use("/quote", new QuoteViewSet().asRouter());

module.exports = quoteBuilderRouter;
