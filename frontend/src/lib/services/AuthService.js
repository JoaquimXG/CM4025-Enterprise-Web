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
		let response = await FetchService.get('/api/auth/isauthenticated');
		return response.ok;
	},

	isAdmin: async () => {
		let response = await FetchService.get('/api/auth/isadmin');
		return response.ok;
	},

	login: async (e, { email, password, saveEmail }) => {
		e.preventDefault();
		if (saveEmail) localStorage.setItem(settings.emailLocalStoreKey, email);

		let response = await FetchService.post('/api/auth/login/', { email, password });
		if (response.ok) redirectAuthedUser(); // Probably best to leave this to the caller
		return response.ok;
	},

	logout: async (e) => {
		// Logout user, redirect if successful. If not, return false, and allow caller to handle
		e.preventDefault();
		let response = await FetchService.post('/api/auth/logout/', undefined);
		if (response.ok) window.location.href = '/auth/login/';
		return response.ok;
	},

	register: async (e, { email, password, password2, firstName, lastName }) => {
		e.preventDefault();
		let response = await FetchService.post('/api/auth/register/', {
			email,
			password,
			password2,
			firstName,
			lastName
		});
		if (response.ok) window.location.href = '/app/';
		return response.ok;
	}
};
