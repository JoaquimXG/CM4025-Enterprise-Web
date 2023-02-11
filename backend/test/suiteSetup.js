const { sequelize } = require("../core/db");
afterAll(() => sequelize.close());
