import settings from '../settings';
import FetchService from './FetchService';
import { onMount, setContext } from 'svelte';
import AuthService from '$lib/services/AuthService.js';
import UserContext, { User } from '$lib/contexts/UserContext';
import getCrudService from '$lib/services/CrudService';

const redirectAuthedUser = () => {
	window.location.href = '/app';
};

const redirectNotAuthedUser = () => {
	window.location.href = '/auth/login';
};

const initContext = () => {
	/**
	 * Sets up the user context for all sub components.
	 * Checks if user is authetnicated and if yes, retrieves user data from the server.
	 * Stores user data in a context for all children.
	 *
	 * Uses a promise, ready, to ensure that child components can wait for user data in onMount
	 * before allowing the page to render.
	 */
	const UserService = getCrudService('/auth/user');

	let readyResolver;
	let ready = new Promise((res) => (readyResolver = res));
	let isAuthenticated = false;
	let isAdmin = false;

	setContext(UserContext, {
		User,
		isAuthenticated: () => isAuthenticated,
		isAdmin: () => isAdmin,
		ready
	});

	onMount(async () => {
		isAuthenticated = await AuthService.isAuthenticated();

		if (!isAuthenticated) {
			readyResolver();
			return;
		}

		let response = await UserService.retrieve('me');
		if (!response.ok) return;

		let user = await response.json();
		User.set(user);
		isAdmin = user.isAdmin;
		readyResolver();
	});
};

export default {
	redirectAuthedUser,
	redirectNotAuthedUser,
	initContext,

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
