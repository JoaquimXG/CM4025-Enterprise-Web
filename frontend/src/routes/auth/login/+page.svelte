<script>
	import CenteredLayout from '$lib/CenteredLayout.svelte';
	import { Content, Grid, Row, Column, Button } from 'carbon-components-svelte';
</script>

<CenteredLayout>
		<Column style="border: 1px solid blue;" sm={0} md={1} lg={2} />
		<Column sm={4} md={6} lg={16} style="background: red;">
			<h1>Quote Builder</h1>
			<p>Create Projects, build quotes, assign tasks, and calculate costs; all in on place.</p>
		</Column>
		<Column style="border: 1px solid blue;" sm={0} md={1} lg={2} />
</CenteredLayout>
