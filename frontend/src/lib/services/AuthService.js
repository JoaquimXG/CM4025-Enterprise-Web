import settings from '../settings';

const redirectAuthedUser = () => {
	window.location.href = '/app';
};

export default {
	redirectAuthedUser,

	isAuthenticated: async () => {
		try {
			let response = await fetch(`${settings.host}/api/auth/isauthenticated`, { method: 'GET' });
			return response.ok;
		} catch {
			return false;
		}
	},

	isAdmin: async () => {
		try {
			let response = await fetch(`${settings.host}/api/auth/isadmin`, { method: 'GET' });
			return response.ok;
		} catch {
			return false;
		}
	},

	login: (e, { email, password, saveEmail }) => {
		e.preventDefault();
		if (saveEmail) {
			localStorage.setItem(settings.emailLocalStoreKey, email);
		}
		fetch(`${settings.host}/api/auth/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})
			.then((response) => {
				if (response.ok) {
					redirectAuthedUser();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	},

	logout: (e) => {
		e.preventDefault();
		fetch(`${settings.host}/api/auth/logout/`, { method: 'POST' })
			.then(() => {
				window.location.href = '/auth/login/';
			})
			.catch((error) => {
				console.log(error); // TODO what is the error case here?
				window.location.href = '/auth/login/';
			});
	},

	register: (e, { email, password, password2, firstName, lastName }) => {
		e.preventDefault();
		fetch(`${settings.host}/api/auth/register/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, password2, firstName, lastName })
		})
			.then((response) => {
				console.log(response);
				window.location.href = '/auth/login/';
			})
			.catch((error) => {
				console.log(error);
			});
	}
};
