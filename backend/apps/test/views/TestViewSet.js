const { ModelViewSet } = require("../../../core/views");
const sequelize = require("../../../core/db/sequelize");
const { TestController } = require("../controllers");

module.exports = class TestViewSet extends ModelViewSet {
  model = sequelize.models.TestModel;
  controller_class = TestController;
};
