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

const getBackendFieldErrors = (errorResponse, fields) => {
	/**
	 * The backend API will return field errors in a constant format.
	 * Here we attempt to match field errors to form fields and displya localised error messages
	 */
	let fieldKeysToIndex = Object.fromEntries(fields.map((field, i) => [field.key, i]));
	for (let key in errorResponse) {
		if (key in fieldKeysToIndex) {
			let field = fields[fieldKeysToIndex[key]];
			field.invalid = true;
			field.invalidText = errorResponse[key].map((e) => e.message).join(', ')
		}
	}
	Fields.set(fields)
};

export default {
	validateField,
	validate,
	fillEmptyDropdown,
	fillEmptyDropdowns,
	getBackendFieldErrors,
	clearInvalid(field, fields, forceUpdate = true) {
		if (!field.invalid) return;
		field.invalid = false;
		field.invalidText = '';
		if (forceUpdate) Fields.set(fields);
	}
};
