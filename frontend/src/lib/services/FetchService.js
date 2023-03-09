import settings from '../settings';

const withDataConfig = {
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json'
	}
};

const _write = async (path, data, method) => {
	let options = {};
	if (data === undefined) options = { method: method, credentials: 'include' };
	else
		options = {
			...withDataConfig,
			method: method,
			body: JSON.stringify(data)
		};

	try {
		let response = await fetch(`${settings.host}${path}`, options);
		return response;
	} catch (error) {
		return { ok: false, _fetchError: true, error: error };
	}
};

export default {
	get: async (path) => {
		try {
			let response = await fetch(`${settings.host}${path}`, {
				method: 'GET',
				credentials: 'include'
			});
			return response;
		} catch (error) {
			return { ok: false, _fetchError: true, error: error };
		}
	},

	post: async (path, data) => {
		return await _write(path, data, 'POST');
	},

	patch: async (path, data) => {
		return await _write(path, data, 'PATCH');
	},

	delete: async (path) => {
		return await _write(path, undefined, 'DELETE');
	},

	put: async (path, data) => {
		return await _write(path, data, 'PUT');
	}
};
