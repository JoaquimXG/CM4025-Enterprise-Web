const ModelController = require("../../../core/controllers/ModelController");
const sequelize = require("../../../core/db/sequelize");

module.exports = class WorkerController extends ModelController {
  meta = {
    model: sequelize.models.Worker,
    fields: "__all__",
  };

  getFieldNames(declaredFields, info) {
    let fields = super.getFieldNames(declaredFields, info);

    // Remove rate if user is not admin
    if (!this.context.req.user.isAdmin) {
      fields.delete("rate");
    }
    return fields;
  }
};
