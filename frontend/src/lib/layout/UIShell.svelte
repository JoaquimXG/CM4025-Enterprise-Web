<script>
	import UIShellNav from './UIShellNav.svelte';
	import UIShellHeader from './UIShellHeader.svelte';

	export let isAuthenticated = false;

	let isSideNavOpen = false;
</script>

<UIShellHeader bind:isSideNavOpen bind:isAuthenticated/>
<UIShellNav bind:isSideNavOpen />
