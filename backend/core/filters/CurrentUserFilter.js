module.exports = class CurrentUserAccessPolicyFilter {
  /**
   * Filters all requests to only return objects owned by the current user.
   * Only to be used with models that have a `userId` field directly on the model,
   * or have a relation to a User model through related models.
   *
   * A model must have a `getUserFilter` method to be used with this filter, which
   * should accept the current request.
   *
   * This filter is intended to be used with the `accessPolicy` filter on ModelApiView.
   */

  constructor(model) {
    this.model = model;
  }

  getFilter(req) {
    return this.model.getUserFilter(req);
  }
};
