require("dotenv").config();

//HTTP host, port and protocol for app
PROTOCOL = "http://";
PORT = process.env.PORT ? process.env.PORT : 8080;
if (process.env.HTTPS == "true") {
  PROTOCOL = "https://";
  PORT = process.env.HTTPSPORT;
}
HOST = process.env.HOST ? process.env.HOST : "localhost";

SESSION_SECRET = process.env.SESSION_SECRET
  ? process.env.SESSION_SECRET
  : "secret";

MYSQL_USER = process.env.MYSQL_USER;
MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
MYSQL_DATABASE = process.env.MYSQL_DATABASE;
MYSQL_HOST = process.env.MYSQL_HOST;
SEQUELIZE_MIGRATE = process.env.SEQUELIZE_MIGRATE;


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
  SEQUELIZE_MIGRATE

};
