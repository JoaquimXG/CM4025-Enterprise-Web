const { DataTypes } = require("sequelize");

const Project = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  name: {
    type: DataTypes.STRING,
    customFieldOptions: {
      controllerType: "CharField",
      maxLength: 255,
    },
  },
};

module.exports = (sequelize) => {
  const project = sequelize.define("Project", Project, { paranoid: true });

  // TODO review this but I don't think Project needs a getUser method becaue
  // Sequelize will automatically generate it.
  // It will be worth keeping this method commented out here for documentation
  // project.prototype.getUser = (instance) => {
  //   return instance.getUser();
  // };

  project.getUserFilter = (req) => {
    return { userId: req.user.id };
  };

  return project;
};
