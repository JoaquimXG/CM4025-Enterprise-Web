<script>
	import UIShellNav from './UIShellNav.svelte';
	import UIShellHeader from './UIShellHeader.svelte';

	let isSideNavOpen = false;
</script>

<UIShellHeader bind:isSideNavOpen />
<UIShellNav bind:isSideNavOpen />
