const settings = require("../settings");

module.exports = (sequelize) => {
  let { User, Worker, Project, Quote } = sequelize.models;

  User.hasMany(Project);
  Project.belongsTo(User);

  Project.hasMany(Quote);
  Quote.belongsTo(Project);

  // TODO getting some issues with deadlock
  if (settings.SEQUELIZE_MIGRATE) {
    // User.sync({ alter: true });
    Project.sync({ alter: true });
    Quote.sync({ alter: true });
  }
};
