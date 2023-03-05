import settings from '../settings';
import FetchService from './FetchService';

const redirectAuthedUser = () => {
	window.location.href = '/app';
};

const redirectNotAuthedUser = () => {
	window.location.href = '/auth/login';
};

export default {
	redirectAuthedUser,
	redirectNotAuthedUser,

	isAuthenticated: async () => {
		try {
			let response = await FetchService.get('/api/auth/isauthenticated', false);
			return response.ok;
		} catch {
			return false;
		}
	},

	isAdmin: async () => {
		try {
			let response = await FetchService.get('/api/auth/isadmin', false);
			return response.ok;
		} catch {
			return false;
		}
	},

	login: async (e, { email, password, saveEmail }) => {
		e.preventDefault();
		if (saveEmail) {
			localStorage.setItem(settings.emailLocalStoreKey, email);
		}
		try {
			let response = await fetch(`${settings.host}/api/auth/login/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});
			if (response.ok) redirectAuthedUser();
			return response.ok;
		} catch (error) {
			console.log(error);
		}
	},

	logout: async (e) => {
		e.preventDefault();
		try {
			let response = await FetchService.post('/api/auth/logout/');
			window.location.href = '/auth/login/';
			return response.ok;
		} catch (error) {
			window.location.href = '/auth/login/';
			console.log(error); // TODO(LOW) what is the error case here?
		}
	},

	register: async (e, { email, password, password2, firstName, lastName }) => {
		e.preventDefault();
		try {
			let response = await FetchService.post('/api/auth/register/', {
				email,
				password,
				password2,
				firstName,
				lastName
			});
			if (response.ok) window.location.href = '/app/';
			return response.ok;
		} catch (error) {
			console.log(error);
		}
	}
};
