require("dotenv").config();

let protocol = "http://";
let port = process.env.PORT ? process.env.PORT : 8080;

if (process.env.HTTPS == "true") {
  protocol = "https://";
  port = process.env.HTTPSPORT;
}

module.exports = {
  //HTTP host, port and protocol for app
  PROTOCOL: protocol,
  PORT: port,
  HOST: process.env.HOST ? process.env.HOST : "localhost",

  // MYSQL
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_HOST: process.env.MYSQL_HOST,
  SEQUELIZE_MIGRATE: process.env.SEQUELIZE_MIGRATE,

  // LOGGING
  LOG_CONSOLE: process.env.LOG_CONSOLE || false,
  FILE_LOG_LEVEL: process.env.FILE_LOG_LEVEL || "info",
  CONSOLE_LOG_LEVEL: process.env.CONSOLE_LOG_LEVEL || "debug",

  // Testing
  INIT_TESTS: process.env.INIT_TESTS || false,

  // Sessions
  SESSION_SECRET: process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : "secret",
  USE_SESSION_STORE: process.env.SESSION_STORE || true,
  
  // Debug routes
  DEBUG_ROUTES: process.env.DEBUG_ROUTES || false,
};
