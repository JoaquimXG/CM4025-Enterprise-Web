const sequelize = require("./sequelize");
const { log } = require("../utils");

const testConnection = async (close = false) => {
  try {
    await sequelize.authenticate();
    log.debug("Database connection has been established successfully.");
    if (close) sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

if (require.main === module) {
  testConnection(true);
}

module.exports = testConnection;
