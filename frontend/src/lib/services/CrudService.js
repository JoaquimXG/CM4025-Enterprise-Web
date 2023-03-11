import FetchService from './FetchService';

export default function getCrudService(resourcePath) {
	let path = `/api${resourcePath}`;
	return {
		list: async () => {
			return await FetchService.get(path);
		},

		retrieve: async (id) => {
			return await FetchService.get(`${path}/${id}`);
		},

		create: async (data) => {
			return await FetchService.post(path, data);
		},

		update: async (id, data) => {
			return await FetchService.patch(`${path}/${id}`, data);
		},

		delete: async (id) => {
			return await FetchService.delete(`${path}/${id}`);
		},
		
		// Only for a couple of objects
		total: async (id) => {
			return await FetchService.get(`${path}/${id}/total/`);
		}
	};
}
