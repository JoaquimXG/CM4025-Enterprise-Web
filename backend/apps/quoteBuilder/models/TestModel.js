const { DataTypes } = require("sequelize");
const { MaxValueValidator } = require("../../../core/fields/validators");

const TestModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  testString: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // TODO document custom field optoins and validation process
  testStringWithLength: {
    type: DataTypes.STRING(50),
    allowNull: true,
    customFieldOptions: {
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
  },
  testStringWithDefaultValueAllowNullFalse: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "test",
  },
  testInt: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  testIntWithMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // validators: [new MaxValueValidator(100)],
    validate: {
      max: 100,
    }
  },
  testIntWithDefaultValueAllowNullTrue: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100,
  },
  testIntWithDefaultValueAllowNullFalse: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
};

module.exports = (sequelize) => {
  let testModel = sequelize.define("TestModel", TestModel, { paranoid: true });
  return testModel;
};
