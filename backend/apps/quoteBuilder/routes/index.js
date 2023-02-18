const { Router } = require("express");
const {
  ProjectViewSet,
  QuoteViewSet,
  StaticCostViewSet,
  TaskViewSet,
  WorkerViewSet,
  TimeEntryViewSet,
} = require("../views");

const quoteBuilderRouter = Router();

quoteBuilderRouter.use("/project", new ProjectViewSet().asRouter());
quoteBuilderRouter.use("/quote", new QuoteViewSet().asRouter());
quoteBuilderRouter.use("/static_cost", new StaticCostViewSet().asRouter());
quoteBuilderRouter.use("/task", new TaskViewSet().asRouter());
quoteBuilderRouter.use("/time_entry", new TimeEntryViewSet().asRouter());
quoteBuilderRouter.use("/worker", new WorkerViewSet().asRouter());

module.exports = quoteBuilderRouter;
