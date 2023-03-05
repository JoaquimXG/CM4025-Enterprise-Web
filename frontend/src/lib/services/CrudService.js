import FetchService from './FetchService';

export default function getCrudService(resourcePath) {
	let path = `/api${resourcePath}`;
	return {
		list: async () => {
			try {
				return FetchService.get(path);
			} catch (error) {
				console.log(error);
			}
		},

		retrieve: async (id) => {
			try {
				return FetchService.get(`${path}/${id}`);
			} catch (error) {
				console.log(error);
			}
		},

		create: async (data) => {
			try {
				return FetchService.post(path, data);
			} catch (error) {
				console.log(error);
			}
		},

		update: async (id, data) => {
			try {
				return FetchService.patch(`${path}/${id}`, data);
			} catch (error) {
				console.log(error);
			}
		},

		delete: async (id) => {
			try {
				return FetchService.delete(`${path}/${id}`);
			} catch (error) {
				console.log(error);
			}
		}
	};
}
