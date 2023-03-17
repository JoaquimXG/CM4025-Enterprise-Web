/**
 * Attempt to choose the correct hostname to use when speaking to the backend.
 * This is only required when the frontend and backend are on different hosts, e.g., during development
 * If the frontend and backend are on the same host, these variables can be left unset, or
 * the PUBLIC_SAME_HOST variable can be set to true
 */
import {env} from '$env/dynamic/public';
const { PUBLIC_BACKEND_HOST, PUBLIC_BACKEND_PORT, PUBLIC_HTTPS, PUBLIC_SAME_HOST } = env;

let host;
if (PUBLIC_SAME_HOST == 'true' || !PUBLIC_BACKEND_HOST || !PUBLIC_BACKEND_PORT || !PUBLIC_HTTPS) {
	// If either same host is set, or if any of required host specific vars are not set, use same host
	host = '';
} else {
	host = `${
		PUBLIC_HTTPS === 'true' ? 'https' : 'http'
	}://${PUBLIC_BACKEND_HOST}:${PUBLIC_BACKEND_PORT}`;
}

export default {
	host: host,
	emailLocalStoreKey: 'saved-email'
};
