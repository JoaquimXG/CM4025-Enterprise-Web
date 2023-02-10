"use strict";

const { Empty, SkipField, Field } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class BaseController extends Field {
  _errors = undefined;
  validated = undefined;
  initial = {}

  constructor(instance = null, data = new Empty(), options = {}) {
    super(options);
    this.instance = instance;
    this.initial_data = data !== new Empty() ? data : null;
    this.partial = options.partial || false;
    this._context = options.context || {};
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
    if (this.validated === undefined)
      throw new Error("is_valid() must be called before save()");

    if (this.errors !== null)
      throw new Error("Can't call save() on a controller with invalid data");

    if (this._data !== null) {
      throw new Error("Cannot save after accessing data");
    }
    this.validated_data = {...this.validated_data, ...additional_data}

    if (this.instance !== null) {
      let instance = this.update(this.instance, this.validated_data);
      if (!instance)
        throw new Error("update() must return an instance");
      return instance;
    } else {
      this.create(this.validated_data);
      if (!instance)
        throw new Error("create() must return an instance");
      return instance;
    }
  }

  is_valid(raiseError) {
    if (this.initial_data === null) {
      throw new Error(
        "Data must be passed to controller before calling is_valid"
      );
    }
    // TODO confirm that controller was initialised with data

    if (this._validated_data === undefined) {
      try {
        this._validated_data = this.run_validation(this.initial_data);
        this._errors = null;
      } catch (e) {
        // TODO should specifically catch validation errors from fields
        this._validated_data = {};
        this.validated = false;
        // TODO improve errors
        this._errors = [{ message: e.message }];
        throw e;
      }
    }

    if (this._errors && raiseError) {
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
      else {
        this._data = this.get_initial()
      }
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
