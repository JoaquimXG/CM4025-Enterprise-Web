<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import getCrudService from '$lib/services/CrudService';

	const toRepresentation = (instance) => {
		return {
			...instance,
			quoteLink: {
				value: instance._quoteName,
				link: `/app/quotes/?id=${instance.Quote}`,
				type: 'link'
			}
		};
	};

	let resourcePath = '/quote_builder/static_cost';
	let detailModalConfig = {
		type: 'Task',
		identityField: 'name',
		fields: [
			{
				key: 'name',
				title: 'Static Cost Name',
				type: 'text',
				required: true
			},
			{
				key: 'Quote',
				title: 'Quote',
				type: 'dropdown',
				required: true,
				items: {
					service: getCrudService('/quote_builder/quote'),
					keyField: 'name'
				}
			},
			{
				key: 'cost',
				title: 'Cost (£)',
				type: 'number',
				required: true
			}
		],
		resourcePath
	};
	let crudTableHeaders = [
		{
			key: 'name',
			value: 'Name'
		},
		{
			key: 'quoteLink',
			value: 'Quote'
		},
		{
			key: 'cost',
			value: 'Cost (£)'
		},
		{
			key: 'overflow',
			empty: true
		}
	];
</script>

<Content>
	<Grid fullWidth style="padding: 0;">
		<Row class="row-header">
			<Column>
				<Breadcrumb noTrailingSlash aria-label="Page navigation">
					<BreadcrumbItem href="/app">Dashboard</BreadcrumbItem>
					<BreadcrumbItem href="/app/tasks">Static Costs</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable
			{resourcePath}
			headers={crudTableHeaders}
			title="Static Costs"
			{detailModalConfig}
			DetailModal={BaseDetailModal}
			{toRepresentation}
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
