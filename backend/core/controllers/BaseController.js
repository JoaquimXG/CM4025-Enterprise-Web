"use strict";
const { Empty, Field } = require("../fields");
const { ValidationError } = require("../responses/errors");

module.exports = class BaseController extends Field {
  _errors = undefined;
  validated = undefined;
  initial = {};

  constructor({ instance = null, data = new Empty(), ...options } = {}) {
    super(options);
    this.instance = instance;
    this.initialData = data !== new Empty() ? data : null;
    this.partial = options.partial || false;
    this._context = options.context || {};
    this.many = options.many || false;
  }

  toInternalValue(data) {
    throw new Error("toInternalValue() must be implemented.");
  }

  toRepresentation(instance) {
    throw new Error("toRepresentation() must be implemented.");
  }

  async update(instance) {
    throw new Error("update() must be implemented.");
  }

  async create(instance) {
    throw new Error("create() must be implemented.");
  }

  async save(additionalData) {
    if (this.validated === undefined)
      throw new Error("isValid() must be called before save()");

    if (this.errors !== null)
      throw new Error("Can't call save() on a controller with invalid data");

    if (this._data !== null) {
      throw new Error("Cannot save after accessing data");
    }
    this.validatedData = { ...this.validatedData, ...additionalData };

    if (this.instance !== null) {
      this.instance = await this.update(this.instance, this.validatedData);
      if (!this.instance) throw new Error("update() must return an instance");
      return this.instance;
    } else {
      this.instance = await this.create(this.validatedData);
      if (!this.instance) throw new Error("create() must return an instance");
      return this.instance;
    }
  }

  isValid(raiseError) {
    if (this.initialData === null) {
      throw new Error(
        "Data must be passed to controller before calling isValid"
      );
    }

    if (this._validatedData === undefined) {
      try {
        this._validatedData = this.runValidation(this.initialData);
        this._errors = null;
      } catch (e) {
        if (!(e instanceof ValidationError)) {
          throw e;
        }
        this._validatedData = {};
        this.validated = false;
        this._errors = [{ message: e.message }];
        throw e;
      }
    }

    if (this._errors && raiseError) {
      throw new ValidationError(this._errors);
    }
    this.validated = this._errors === null;
    return this.validated;
  }

  get data() {
    if (!this.validated) {
      throw new Error("Must validate before getting data");
    }

    if (this._data === null) {
      if (this.instance && this._errors === undefined) {
        this._data = this.toRepresentation(this.instance);
      } else if (this._errors === undefined) {
        this._data = this.toRepresentation(this.validatedData);
      } else {
        this._data = this.getInitial();
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

  get validatedData() {
    if (!this._validatedData) {
      throw new Error("Must call isValid before accessing validatedData");
    }
    return this._validatedData;
  }
};
