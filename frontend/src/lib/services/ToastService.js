const BASETOASTCONFIG = {
	kind: 'error',
	title: 'Error',
	subtitle: '',
	caption: 'Please try again',
	show: true,
	timeout: 3000,
	lowContrast: false
};

const getErrorMessages = async (errorResponse) => {
	/**
	 * Attempt to get useful error message for the user from response
	 * If the response is a fetch error, just return the error message
	 * Otherwise, try to parse the response as JSON and return the message
	 * If the error key is a list, pull all the messages out and join them
	 * If the error key is an object, pull the message out
	 * Otherwise, just return the error key
	 */

	if (errorResponse._fetchError) return errorResponse.error;
	else errorResponse = await errorResponse.json();

	let messages = [];
	console.log(errorResponse);
	for (let key in errorResponse) {
		if (Array.isArray(errorResponse[key]))
			messages.push(errorResponse[key].map((e) => e.message).join(', '));
		else if (typeof errorResponse[key] === 'object') messages.push(errorResponse[key].message);
		else messages.push(errorResponse[key]);
	}
	messages = messages.join('\n');
	return messages;
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

	async getErrorFromResponse({ title, subtitle, caption, response } = {}) {
		// Attempt to get a formatted error from the response for the toast message

		if (!caption)
			if (response._fetchError) caption = response.error;
			else {
				try {
					caption = await getErrorMessages(response);
				} catch (e) {
					caption = `Please try again: ${response.error}`;
				}
			}

		return {
			...BASETOASTCONFIG,
			title: title ? title : BASETOASTCONFIG.title,
			subtitle: subtitle ? subtitle : BASETOASTCONFIG.subtitle,
			caption
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
