require("dotenv").config();

//HTTP host, port and protocol for app
PROTOCOL = "http://";
PORT = process.env.PORT ? process.env.PORT : 8080;
if (process.env.HTTPS == "true") {
  PROTOCOL = "https://";
  PORT = process.env.HTTPSPORT;
}
HOST = process.env.HOST ? process.env.HOST : "localhost";

// MYSQL
MYSQL_USER = process.env.MYSQL_USER;
MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
MYSQL_DATABASE = process.env.MYSQL_DATABASE;
MYSQL_HOST = process.env.MYSQL_HOST;
SEQUELIZE_MIGRATE = process.env.SEQUELIZE_MIGRATE;

// LOGGING
LOG_CONSOLE = process.env.LOG_CONSOLE || false;
FILE_LOG_LEVEL = process.env.FILE_LOG_LEVEL || "info";
CONSOLE_LOG_LEVEL = process.env.CONSOLE_LOG_LEVEL || "debug";

// Testing
INIT_TESTS = process.env.INIT_TESTS || false;

SESSION_SECRET = process.env.SESSION_SECRET
  ? process.env.SESSION_SECRET
  : "secret";

//Applies defaults for environment variables where applicable
//Allows for reuse throughout the application
module.exports = {
  PROTOCOL,
  PORT,
  HOST,
  SESSION_SECRET,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_HOST,
  SEQUELIZE_MIGRATE,
  LOG_CONSOLE,
  FILE_LOG_LEVEL,
  CONSOLE_LOG_LEVEL,
  INIT_TESTS,
};
