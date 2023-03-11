export default class MinuteField {
	static toInternalValue(value) {
		// Check if : in minutes string, split into hh:mm and convert to minutes
		// else, assume minutes
		if (value.includes(':')) {
			let [hh, mm] = value.split(':');
			return parseInt(hh) * 60 + parseInt(mm);
		} else {
			return parseInt(value);
		}
	}

	static toRepresentation(value) {
		/*
		 * Converts minutes to HH:MM format
		 */
		if (value === undefined) return value;
		let minutes = value % 60;
		let hours = (value - minutes) / 60;
		return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}`;
	}
}
