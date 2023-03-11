const ModelController = require("../../../core/controllers/ModelController");
const {
  DeclaredField,
  UserRestrictedPrimaryKeyRelatedField,
  CharField,
} = require("../../../core/fields");
const { ValidationError } = require("../../../core/responses/errors");
const sequelize = require("../../../core/db/sequelize");

module.exports = class TimeEntryController extends ModelController {
  Task = new DeclaredField(UserRestrictedPrimaryKeyRelatedField, {
    model: sequelize.models.TimeEntry,
    targetModel: sequelize.models.Task,
    // Not required when updating but we will enforce required in create
    required: false,
  });
  _taskName = new DeclaredField(CharField, {
    source: "Task.name",
    readOnly: true,
  });
  _workerTitle = new DeclaredField(CharField, {
    source: "Worker.title",
    readOnly: true,
  });

  meta = {
    model: sequelize.models.TimeEntry,
    fields: "__all__",
  };

  async create(validatedData) {
    if (!("TaskId" in validatedData)) {
      throw new ValidationError({ Task: "This field is required" });
    }
    return await super.create(validatedData);
  }
};
