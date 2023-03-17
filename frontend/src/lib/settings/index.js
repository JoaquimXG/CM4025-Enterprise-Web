import {
	PUBLIC_BACKEND_HOST,
	PUBLIC_BACKEND_PORT,
	PUBLIC_HTTPS,
	PUBLIC_SAME_HOST
} from '$env/static/public';

// Use the same host for the backend if the env variable is set to true
// Otherwise use the host and port specified in the env variables
// Setting host and port will cause problems with mixed content if not careful
let host = '';
if (PUBLIC_SAME_HOST === 'true') {
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
