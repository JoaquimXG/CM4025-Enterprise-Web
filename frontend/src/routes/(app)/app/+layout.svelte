<script>
	import 'carbon-components-svelte/css/g100.css';
	import { Content, Grid } from 'carbon-components-svelte';
	import UIShell from '$lib/layout/UIShell.svelte';
</script>

<UIShell />

<Content>
	<Grid fullWidth>
		<slot />
	</Grid>
</Content>
