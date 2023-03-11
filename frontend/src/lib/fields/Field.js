export default class Field {
  /**
   * A much simpler representation of a field for use on the frontend
   * This is really only being used for formatting, not for validation.
   * This base class does not mutate.
   */
	static toInternalValue(value) {
		return value;
	}
	static toRepresentation(value) {
		return value;
	}
}
