const settings = require("../settings");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
const logger = require("./logger");
const sequelize = require("../db/sequelize");
const passport = require("../../apps/auth/middleware/passport");

//Sets up all of the middleware required for our app.
//It is useful to keep this in a separate file to keep app.js tidy and
//primarily containing only the application routes
module.exports = (app) => {
  //Express-Sessions for session data
  var secret = settings.SESSION_SECRET;
  var sessionArgs = {
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: false },
    store: settings.USE_SESSION_STORE
      ? new SessionStore({ db: sequelize })
      : null,
  };

  app.use(session(sessionArgs));

  app.use(passport.initialize());
  app.use(passport.session());

  //HTTP body parse for handling post requests
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  //HTTP body parser for json post requests
  app.use(bodyParser.json());
  //Cookie parser
  app.use(cookieParser());
  //Public folder for images, css and js files
  app.use(express.static(path.join(__dirname, "../public")));
  //Compress files before sending
  app.use(compression());

  //Folder for html/ejs views
  app.set("views", path.join(__dirname, "../views"));

  //Logging with winston used as middleware to log all requests made to backend
  app.use(logger);

  return app;
};
