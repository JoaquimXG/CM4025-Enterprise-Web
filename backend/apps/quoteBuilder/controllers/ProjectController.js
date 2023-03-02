const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class ProjectController extends ModelController {
  meta = {
    model: sequelize.models.Project,
    fields: "__all__",
    extraOptions: {
      User: { required: false },
    },
  };

  async create(validatedData) {
    // Set User Id to default to the current user on create
    if (!("UserId" in validatedData)) {
      validatedData.UserId = this.user.id;
    }
    return await super.create(validatedData);
  }
};
