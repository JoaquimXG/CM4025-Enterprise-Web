import settings from '../settings';

const withDataConfig = {
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json'
	}
};

const _write = async (path, data, method, json) => {
	let response = null;
	if (data === undefined)
		response = await fetch(`${settings.host}${path}`, { method: method, credentials: 'include' });
	else {
		response = await fetch(`${settings.host}${path}`, {
			...withDataConfig,
			method: method,
			body: JSON.stringify(data)
		});
	}
	if (json) return await response.json();
	else return response;
};

export default {
	get: async (path, json = true) => {
		let response = await fetch(`${settings.host}${path}`, {
			method: 'GET',
			credentials: 'include'
		});
		if (json) return await response.json();
		else return response;
	},

	post: async (path, data, json = true) => {
		_write(path, data, 'POST', json);
	},

	patch: async (path, data, json = true) => {
		_write(path, data, 'PATCH', json);
	},

	delete: async (path, json = true) => {
		_write(path, null, 'DELETE', json);
	},

	put: async (path, data, json = true) => {
		_write(path, data, 'PUT', json);
	}
};
