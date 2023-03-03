const { DataTypes } = require("sequelize");

const Task = {
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
  const task = sequelize.define("Task", Task, { paranoid: true });

  task.prototype.getUserRelation = async (instance) => {
    let quote = await instance.getQuote();
    let user = await quote.getUserRelation(quote);
    return user;
  };

  task.getUserFilter = (req) => {
    return {
      include: {
        model: sequelize.models.Quote,
        required: true,
        attributes: [],
        ...sequelize.models.Quote.getUserFilter(req),
      },
    };
  };

  return task;
};
