<script>
	import UIShellHeader from '$lib/layout/UIShellHeader.svelte';
	import 'carbon-components-svelte/css/g100.css';
	
	import AuthService from '$lib/services/AuthService';
	
	AuthService.initContext()
</script>

<UIShellHeader />

<slot />
