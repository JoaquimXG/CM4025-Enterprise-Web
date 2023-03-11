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
  minutes: {
    type: DataTypes.INTEGER,
    customFieldOptions: {
      controllerType: "IntegerField",
      maxValue: 1440, // 24 hours
    },
  },
};

module.exports = (sequelize) => {
  const timeEntry = sequelize.define("TimeEntry", TimeEntry, {
    paranoid: true,
  });

  timeEntry.prototype.getUserRelation = async (instance) => {
    let quote = await instance.getQuote();
    let user = await quote.getUserRelation(quote);
    return user;
  };

  timeEntry.getUserFilter = (req) => {
    return {
      include: {
        model: sequelize.models.Task,
        attributes: [],
        required: true,
        ...sequelize.models.Task.getUserFilter(req),
      },
    };
  };

  return timeEntry;
};
