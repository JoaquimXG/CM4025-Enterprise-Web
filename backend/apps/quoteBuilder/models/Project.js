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

  project.prototype.getUser = (instance) => {
    return instance.getUser().id;
  };
  return project;
};
