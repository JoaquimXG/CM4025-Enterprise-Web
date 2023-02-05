const { DataTypes } = require("sequelize");

const TestModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  testString: {
    type: DataTypes.STRING,
    allowNull: true,
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  // TODO document custom field optoins and validation process
  testStringWithLength: {
    type: DataTypes.STRING(50),
    allowNull: true,
    customFieldOptions: {
      controllerType: "CharField",
      maxLength: 50,
      blank: true,
      validators: []
    },
  },
  testStringWithDefaultValueAllowNullTrue: {
    type: DataTypes.STRING,
    allowNull: true,
    choices: ["test", "test2"],
    defaultValue: "test",
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  testStringWithDefaultValueAllowNullFalse: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "test",
    customFieldOptions: {
      controllerType: "CharField",
    }
  },
  testInt: {
    type: DataTypes.INTEGER,
    allowNull: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  testIntWithMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  testIntWithDefaultValueAllowNullTrue: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
  testIntWithDefaultValueAllowNullFalse: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    customFieldOptions: {
      controllerType: "IntegerField",
    }
  },
};

module.exports = (sequelize) => {
  let testModel = sequelize.define("TestModel", TestModel, { paranoid: true });
  return testModel;
};
