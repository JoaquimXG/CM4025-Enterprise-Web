// TODO extend this at some point maybe, probably not
import { PUBLIC_BACKEND_HOST, PUBLIC_BACKEND_PORT, PUBLIC_HTTPS } from '$env/static/public';

export default {
	host: `${
		PUBLIC_HTTPS === 'true' ? 'https' : 'http'
	}://${PUBLIC_BACKEND_HOST}:${PUBLIC_BACKEND_PORT}`,
	emailLocalStoreKey: 'saved-email',
};
