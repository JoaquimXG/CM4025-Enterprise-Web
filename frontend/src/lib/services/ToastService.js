const BASETOASTCONFIG = {
	kind: 'error',
	title: 'Error',
	subtitle: '',
	caption: 'Please try again',
	show: true,
	timeout: 3000,
	lowContrast: false
};

export default {
	/**
	 * Functions for generating toast configurations across the app
	 */
	init() {
		return { show: false };
	},
	getError({ title, subtitle, caption } = {}) {
		return {
			...BASETOASTCONFIG,
			title: title ? title : BASETOASTCONFIG.title,
			subtitle: subtitle ? subtitle : BASETOASTCONFIG.subtitle,
			caption: caption ? caption : BASETOASTCONFIG.caption
		};
	},

	getErrorFromResponse({ title, subtitle, response } = {}) {
		// Attempt to get a formatted error from the response for the toast message
		let caption = response._fetchError
			? `Please try again: ${response.error}`
			: `${response.status}: ${response.statusText}`;
		return {
			...BASETOASTCONFIG,
			title: title ? title : BASETOASTCONFIG.title,
			subtitle: subtitle ? subtitle : BASETOASTCONFIG.subtitle,
			caption: caption
		};
	},

	getSuccess({ title, subtitle, caption } = {}) {
		return {
			...BASETOASTCONFIG,
			kind: 'success',
			title: title ? title : 'Success',
			subtitle: subtitle ? subtitle : BASETOASTCONFIG.subtitle,
			caption: caption ? caption : ''
		};
	}
};
