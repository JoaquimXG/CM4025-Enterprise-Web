import settings from '../settings';

const withDataConfig = {
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json'
	}
};

export default {
	get: async (path) => {
		return await fetch(`${settings.host}${path}`, { method: 'GET', credentials: 'include' });
	},

	post: async (path, data) => {
		if (data === undefined)
			return await fetch(`${settings.host}${path}`, { method: 'POST', credentials: 'include' });
		return await fetch(`${settings.host}${path}`, {
			...withDataConfig,
			method: 'POST',
			body: JSON.stringify(data)
		});
	}
};
