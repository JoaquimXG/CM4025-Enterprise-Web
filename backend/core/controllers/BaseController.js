const { Empty, SkipField, Field } = require("../fields");

module.exports = class BaseController extends Field {
  _errors = undefined;
  initial_data = undefined;
  validated = undefined;

  constructor(instance = null, data = Empty, options) {
    this.instance = instance;
    if (data !== Empty) this.initial_data = data;
    this.partial = options.partial || false;
    this._context = options.context || {};
    super(options);
  }

  to_internal_value(data) {
    throw new Error("to_internal_value() must be implemented.");
  }

  to_representation(instance) {
    throw new Error("to_representation() must be implemented.");
  }

  update(instance) {
    throw new Error("update() must be implemented.");
  }

  create(instance) {
    throw new Error("create() must be implemented.");
  }

  save(additional_data) {
    if (validated === undefined)
      throw new Error("is_valid() must be called before save()");

    if (self.errors !== null)
      throw new Error("Can't call save() on a controller with invalid data");

    if (this._data !== null) {
      throw new Error("Cannot save after accessing data");
    }
    // TODO merge validated_data with data passed into save
    // validated_data =  merge(this.validated_data, additional_data)

    //TODO error handling, should be checking that instances are returned from these calls
    if (this.instance !== null) {
      return this.update(this.instance, this.validated_data);
    } else {
      return this.create(this.validated_data);
    }
  }

  is_valid(raiseException = false) {
    if (this.initial_data === null) {
      throw new Error(
        "Data must be passed to controller before calling is_valid"
      );
    }
    // TODO confirm that controller was initialised with data

    if (this.validated_data === undefined) {
      try {
        this._validated_data = this.run_validation(this.initial_data);
        this._errors = null;
      } catch {
        // TODO should specifically catch validation errors from fields
        self.validated_data = {};
        self.validated = false;
        // TODO improve errors
        this._errors = [{ message: "There have been some errors" }];
      }
    }

    if (this._errors && raiseException) {
      throw new ValidationError(this._errors);
    }
    return this._errors === null;
  }

  get data() {
    // TODO review this, it should be implemented so that this fails if is_valid
    // has not been called
    if (!this.validated) {
      throw new Error("Must validate before getting data");
    }

    if (this._data === null) {
      if (this.instance && this._errors === undefined) {
        this._data = this.to_representation(this.instance);
      } else if (this._errors === undefined) {
        this._data = this.to_representation(this.validated_data);
      }
      //TODO else getInitial
    }

    return this._data;
  }

  get errors() {
    if (!this._errors) {
      throw new Error("Must validate before getting errors");
    }
    return this._errors;
  }

  get validated_data() {
    if (!this._validated_data) {
      throw new Error("Must call is_valid before accessing validated_data");
    }
    return this._validated_data;
  }
};
