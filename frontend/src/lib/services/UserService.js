import FetchService from './FetchService';

export default {
	me: async () => {
		try {
			return await (await FetchService.get('/api/auth/user/me')).json();
		} catch (error) {
			console.log(error);
		}
	}
};
