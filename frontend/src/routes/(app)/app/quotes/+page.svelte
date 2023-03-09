<script>
	import { Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
</script>

<Row class="row-header">
	<Column>
		<Breadcrumb noTrailingSlash aria-label="Page navigation">
			<BreadcrumbItem href="/app">Dashboard</BreadcrumbItem>
			<BreadcrumbItem href="/app/quotes">Quotes</BreadcrumbItem>
		</Breadcrumb>
	</Column>
</Row>

<CrudTable resourcePath="/quote_builder/quote" title="Quotes"/>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
	:global(.row-header__title) {
		margin-top: 'spacing-03';
	}
</style>
