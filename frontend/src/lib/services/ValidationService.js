import { Fields, Instance } from '$lib/stores/DetailModalStore';

const validateField = (field, value, fields, forceUpdate = true) => {
	/**
	 * Validate an individual field.
	 * Currently only validating whether a field is required or not
	 * But there is no reason why we could not apply a list of arbitrary validators
	 * to each field.
	 */
	let isValid = true;
	if (field.required) {
		if ((field.type === 'dropdown' && value === -1) || !value) {
			field.invalid = true;
			field.invalidText = `${field.title} is required`;
			isValid = false;
		}
	} else {
		field.invalid = false;
		field.invalidText = '';
	}
	if (forceUpdate) Fields.set(fields);

	return isValid;
};

const validate = (fields, object) => {
	/**
	 * Validate all fields in turn
	 */
	let isValid = true;
	fields.forEach((field) => {
		if (!validateField(field, object[field.key], fields, false)) {
			isValid = false;
		}
	});

	Fields.set(fields);
	return isValid;
};

const fillEmptyDropdown = (field, object, forceUpdate = true) => {
	if (!object[field.key]) object[field.key] = -1;
	if (forceUpdate) Instance.set(object);
};

const fillEmptyDropdowns = (fields, object) => {
	fields.forEach((field) => {
		if (field.type === 'dropdown') fillEmptyDropdown(field, object, false);
	});
	Instance.set(object);
};

export default {
	validateField,
	validate,
	fillEmptyDropdown,
	fillEmptyDropdowns,
	clearInvalid(field, fields, forceUpdate = true) {
		if (!field.invalid) return;
		field.invalid = false;
		field.invalidText = '';
		if (forceUpdate) Fields.set(fields);
	}
};
