const { DataTypes } = require("sequelize");

const Worker = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: {
    // This is hourly rate
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

module.exports = (sequelize) => {
  worker = sequelize.define("Worker", Worker, { paranoid: true });
  worker.get_day_rate = (rate) => {
    return rate * 8;
  };
  return worker;
};
