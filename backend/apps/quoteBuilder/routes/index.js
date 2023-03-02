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

quoteBuilderRouter.use(
  "/project",
  new ProjectViewSet().asRouter({
    get: { handler: "total", route: "/:id/total/" },
  })
);
quoteBuilderRouter.use(
  "/quote",
  new QuoteViewSet().asRouter({
    get: { handler: "total", route: "/:id/total/" },
  })
);
quoteBuilderRouter.use("/static_cost", new StaticCostViewSet().asRouter());
quoteBuilderRouter.use(
  "/task",
  new TaskViewSet().asRouter({
    get: { handler: "total", route: "/:id/total/" },
  })
);
quoteBuilderRouter.use(
  "/time_entry",
  new TimeEntryViewSet().asRouter({
    get: { handler: "total", route: "/:id/total/" },
  })
);
quoteBuilderRouter.use("/worker", new WorkerViewSet().asRouter());

module.exports = quoteBuilderRouter;
