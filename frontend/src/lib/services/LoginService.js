import { host } from '../settings/';

export default {
	isAuthenticated: () => {
		fetch({ method: 'GET', url: `${host}/api/auth/isauthenticated` });
	},

	login: (email, password) => {
		fetch({ method: 'POST', url: `${host}/api/auth/login/`, data: { email, password } })
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	logout: () => {
		fetch({ method: 'POST', url: `${host}/api/auth/logout/` })
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	register: (email, password, password2, firstName, lastName) => {
		fetch({
			method: 'POST',
			url: `${host}/api/auth/register/`,
			data: { email, password, password2, firstName, lastName }
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}
};
