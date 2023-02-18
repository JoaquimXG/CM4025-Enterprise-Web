const settings = require("../settings");

module.exports = async (sequelize) => {
  let { User, Worker, Project, Quote } = sequelize.models;

  await User.hasMany(Project);
  await Project.belongsTo(User);

  await Project.hasMany(Quote);
  await Quote.belongsTo(Project);

  // TODO getting some issues with deadlock
  if (settings.SEQUELIZE_MIGRATE) {
    // User.sync({ alter: true });
    Project.sync({ alter: true });
    // Quote.sync({ alter: true });
  }
};
