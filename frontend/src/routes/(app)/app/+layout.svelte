<script>
	import 'carbon-components-svelte/css/g100.css';
	import UIShell from '$lib/layout/UIShell.svelte';

	import AuthService from '$lib/services/AuthService.js';
	import UserContext from '$lib/contexts/UserContext.js';
	import { onMount, getContext } from 'svelte';

	AuthService.initContext();
	const { isAuthenticated, ready } = getContext(UserContext);

	onMount(async () => {
		await ready;
		// Redirect user if not logged in
		if (!isAuthenticated()) AuthService.redirectNotAuthedUser();
	});
</script>

<UIShell />

<slot />
