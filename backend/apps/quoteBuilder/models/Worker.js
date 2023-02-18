const { DataTypes } = require("sequelize");

const Worker = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: {
    // This is hourly rate
    // type: DataTypes.DECIMAL(10, 2), //TODO implement DecimalField
    type: DataTypes.INTEGER, //TODO implement DecimalField
    allowNull: false,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

module.exports = (sequelize) => {
  let worker = sequelize.define("Worker", Worker, { paranoid: true });
  worker.getDayRate = (rate) => {
    return rate * 8;
  };
  return worker;
};
