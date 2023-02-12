/**
 * This is a hack because it is difficult to clone class instances in JavaScript.
 * It is much easier to instantiate a new instance when required. 
 * 
 * Fields directly associated with controllers are instantiated per request as they contain
 * state that is specific to the request.
 * 
 * I would prefer to isntantiate the field in the controller definition but instead I will instantiate
 * this container class, DeclaredField, which will contain the data needed to instantiate the field during
 * a request.
 */
  
module.exports = class DeclaredField {
  constructor(field_class, field_options) {
    this.field_class = field_class;
    this.field_options = field_options;
  }

  get_field() {
    return new this.field_class(this.field_options);
  }
}
  