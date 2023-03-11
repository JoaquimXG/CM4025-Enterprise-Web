<script>
	import 'carbon-components-svelte/css/g100.css';
	import UIShell from '$lib/layout/UIShell.svelte';

	import AuthService from '$lib/services/AuthService.js';

	AuthService.initContext();

</script>

<UIShell />

<slot />
