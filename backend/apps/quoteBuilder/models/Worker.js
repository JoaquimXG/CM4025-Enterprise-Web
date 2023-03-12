const { DataTypes } = require("sequelize");

const Worker = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  rate: {
    // This is hourly rate
    type: DataTypes.INTEGER,
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    customFieldOptions: {
      controllerType: "CharField",
      maxLength: 255,
    },
  },
};

module.exports = (sequelize) => {
  let worker = sequelize.define("Worker", Worker, { paranoid: true });
  worker.getDayRate = (rate) => {
    return rate * 8;
  };
  return worker;
};
