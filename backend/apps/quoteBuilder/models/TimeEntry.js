const { DataTypes } = require("sequelize");

const TimeEntry = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  seconds: {
    type: DataTypes.INTEGER,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
};

module.exports = (sequelize) => {
  return sequelize.define("TimeEntry", TimeEntry, { paranoid: true });
};
