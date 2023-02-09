"use strict";
const path = require("path");
const express = require("express");
const apiRouter = require("./apiRouter");
const { applyMiddleware, errorHandler } = require("./core/middleware");
const { testConnection } = require("./core/db");

testConnection();

let app = express();

//Prepare application with middleware
app = applyMiddleware(app);

app.use("/api/", apiRouter);

app.get("/", (_, res) => {
  // TODO should render
  res.sendFile(path.join(__dirname, `./views/index.html`));
});

app.use(errorHandler);

module.exports = app;
