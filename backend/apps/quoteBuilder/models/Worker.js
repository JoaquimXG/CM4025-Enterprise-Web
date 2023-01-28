const { DataTypes } = require("sequelize");

const Worker = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: { // This is hourly rate
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
};

Worker.get_day_reate = function (rate) {
  return rate * 8 // 8 hours per day
}

module.exports = (sequelize) => {
  return sequelize.define("Worker", Worker, { paranoid: true });
};
