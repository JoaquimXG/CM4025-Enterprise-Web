const { createLogger, format, transports } = require("winston");
const settings = require("../settings");

//Creates a Winston logger object which can be used instead of console.log
const log = createLogger({
  format: format.combine(format.errors({ stack: true })),
  transports: [
    new transports.File({
      level: settings.FILE_LOG_LEVEL,
      filename: "./logs/server.log",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.json()
      ),
    }),
  ],
});

//Creates a custom logging format. This format will pretty print
//any json strings which are logged
const logFormat = format.printf(function (info) {
  return `${info.level}: ${JSON.stringify(info.message, null, 4)}`;
});

// Adds a debug level logger which is only utilised when
// the app is not being deployed into production
if (settings.LOG_CONSOLE) {
  log.add(
    new transports.Console({
      level: settings.CONSOLE_LOG_LEVEL,
      format: format.combine(format.colorize(), logFormat),
      silent: process.argv.indexOf("--silent") >= 0,
    })
  );
}

module.exports = log;
