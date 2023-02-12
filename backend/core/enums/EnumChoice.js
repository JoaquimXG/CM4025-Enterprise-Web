module.exports = class EnumChoice {
  /**
   * A simple interface for creating an enum-like object.
   * @param {Object} choices - An object with key-value pairs.
   * @example
   * const UserStatusChoice = new EnumChoice({
   *  unverified: 0,
   *  verified: 1,
   *  banned: 2,
   * });
   *
   * UserStatusChoice.unverified // 0
   * UserStatusChoice.verified // 1
   * UserStatusChoice.banned // 2
   * UserStatusChoice.names // ["unverified", "verified", "banned"]
   * UserStatusChoice.values // [0, 1, 2]
   */

  constructor(choices) {
    this._choices = choices;
    for (let key in this._choices) {
      this[key] = this._choices[key];
    }
  }

  get names() {
    return Object.keys(this._choices);
  }

  get values() {
    return Object.values(this._choices);
  }
  
};
