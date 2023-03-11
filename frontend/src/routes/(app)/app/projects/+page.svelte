<script>
	import { Grid, Content, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	const toRepresentation = (instance) => {
		return {
			...instance,
			cost: '--'
		};
	};

	let resourcePath = '/quote_builder/project';
	let detailModalConfig = {
		type: 'Project',
		identityField: 'name',
		fields: [
			{
				key: 'name',
				title: 'Project name',
				type: 'text',
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
			key: 'cost',
			value: 'Cost (£)'
		},
		{
			key: 'overflow',
			empty: true
		}
	];
	let overflowConfig = {
		getCost: true
	};
</script>

<Content>
	<Grid fullWidth style="padding: 0;">
		<Row class="row-header">
			<Column>
				<Breadcrumb noTrailingSlash aria-label="Page navigation">
					<BreadcrumbItem href="/app">Dashboard</BreadcrumbItem>
					<BreadcrumbItem href="/app/projects">Projects</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable
			{resourcePath}
			headers={crudTableHeaders}
			title="Projects"
			{detailModalConfig}
			{overflowConfig}
			{toRepresentation}
			DetailModal={BaseDetailModal}
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
