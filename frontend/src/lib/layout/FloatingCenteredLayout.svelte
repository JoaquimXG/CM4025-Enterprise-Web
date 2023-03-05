<script>
	import CenteredVerticalLayout from './CenteredVerticalLayout.svelte';
	import { Column } from 'carbon-components-svelte';
</script>

<CenteredVerticalLayout>
	<Column sm={0} md={1} lg={3} xlg={4} />
	<Column class="column-main" sm={4} md={6} lg={10} xlg={8}>
		<slot />
	</Column>
	<Column sm={0} md={1} lg={3} xlg={4} />
</CenteredVerticalLayout>

<style>
	:global(.column-main) {
		background-color: 'ui-03';
	}
</style>
