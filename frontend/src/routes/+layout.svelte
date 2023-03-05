<script>
	import UIShellHeader from '$lib/layout/UIShellHeader.svelte';
	import 'carbon-components-svelte/css/g100.css';
	import { onMount } from 'svelte';
	import AuthService from '$lib/services/AuthService.js';

	let isAuthenticated = false;
	//TODO, often calling this again in child components, it would be better to use store?
	// Need a way to be able to pass this int the slot
	onMount(async () => {
		isAuthenticated = await AuthService.isAuthenticated();
	});
</script>

<UIShellHeader bind:isAuthenticated />

<slot />
