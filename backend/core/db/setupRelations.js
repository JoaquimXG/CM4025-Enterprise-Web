const settings = require("../settings");

module.exports = async (sequelize) => {
  let { User, Worker, Project, Quote, TimeEntry, Task, StaticCost } =
    sequelize.models;

  await User.hasMany(Project);
  await Project.belongsTo(User);

  await Project.hasMany(Quote);
  await Quote.belongsTo(Project, { allowNull: false });

  await Quote.hasMany(Task);
  await Task.belongsTo(Quote);

  await Task.hasMany(TimeEntry);
  await TimeEntry.belongsTo(Task);

  // TODO review this model decision, should it be a many to many?
  await Worker.hasMany(TimeEntry);
  await TimeEntry.belongsTo(Worker);

  await Quote.hasMany(StaticCost);
  await StaticCost.belongsTo(Quote);

  if (settings.SEQUELIZE_MIGRATE) {
    await User.sync({ alter: true });
    await Project.sync({ alter: true });
    await Quote.sync({ alter: true });
    await Task.sync({ alter: true });
    await TimeEntry.sync({ alter: true });
    await Worker.sync({ alter: true });
    await StaticCost.sync({ alter: true });
  }
};
