"use strict";
const path = require("path");
const express = require("express");
const apiRouter = require("./apiRouter");
const { applyMiddleware, errorHandler } = require("./core/middleware");
const { testConnection } = require("./core/db");
const settings = require("./core/settings");

testConnection();

let app = express();

//Prepare application with middleware
app = applyMiddleware(app);

app.use("/api/", apiRouter);

app.use(errorHandler);

// Save all express routes to a file for debugging
if (settings.DEBUG_ROUTES) {
  var filepath = path.join(__dirname, "routes.txt");
  require("express-print-routes")(app, filepath);
}

module.exports = app;
