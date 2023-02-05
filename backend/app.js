const path = require("path");
const express = require("express");
const apiRouter = require("./apiRouter");
const getAppWithMiddleware = require("./core/middleware");

let app = express();

//Prepare application with middleware
app = getAppWithMiddleware(app);

app.use("/api/", apiRouter);

app.get("/", (_, res) => {
  // TODO should render
  res.sendFile(path.join(__dirname, `./views/index.html`));
});

module.exports = app;
