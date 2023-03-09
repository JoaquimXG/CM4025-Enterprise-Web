<script>
	import 'carbon-components-svelte/css/g100.css';
	import { Content, Grid } from 'carbon-components-svelte';
	import UIShell from '$lib/layout/UIShell.svelte';
	
	import { onMount } from 'svelte';
	import AuthService from '$lib/services/AuthService.js';
	
	let isAuthenticated = false;
	onMount(async () => {
		// Redirect user if not logged in
		if (!(await AuthService.isAuthenticated())) AuthService.redirectNotAuthedUser();
		
		isAuthenticated = true;
	});
</script>

<UIShell bind:isAuthenticated/>

<Content>
	<Grid fullWidth style="padding: 0;">
		<slot />
	</Grid>
</Content>
