require("dotenv").config();
const isTruthy = require("./isTruthy")

// let protocol = "http://";
let port = process.env.PORT ? process.env.PORT : 8080;

// if (process.env.HTTPS == "true") {
//   protocol = "https://";
//   port = process.env.HTTPSPORT;
// }

module.exports = {
  //HTTP host, port and protocol for app
  // PROTOCOL: protocol,
  PORT: port,
  // HOST: process.env.HOST ? process.env.HOST : "localhost",
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : "*",
  DISABLE_CORS: isTruthy(process.env.DISABLE_CORS, false),

  // MYSQL
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_HOST: process.env.MYSQL_HOST,
  SEQUELIZE_MIGRATE: process.env.SEQUELIZE_MIGRATE,

  // LOGGING
  LOG_CONSOLE: isTruthy(process.env.LOG_CONSOLE, false),
  FILE_LOG_LEVEL: process.env.FILE_LOG_LEVEL || "info",
  CONSOLE_LOG_LEVEL: process.env.CONSOLE_LOG_LEVEL || "debug",

  // Testing
  INIT_TESTS: isTruthy(process.env.INIT_TESTS, false),

  // Sessions
  SESSION_SECRET: process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : "secret",
  USE_SESSION_STORE: isTruthy(process.env.USE_SESSION_STORE, true),
  // I would enable secure cookies by default but it is likely that you won't have SSL enabled when running the auto deploy script
  COOKIE_SECURE: isTruthy(process.env.COOKIE_SECURE, false),

  // Debug routes
  DEBUG_ROUTES: isTruthy(process.env.DEBUG_ROUTES, false),
};
