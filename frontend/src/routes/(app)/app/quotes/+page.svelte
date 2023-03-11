<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import getCrudService from '$lib/services/CrudService';

	const toRepresentation = (instance) => {
		return {
			...instance,
			projectLink: {
				value: instance._projectName,
				link: `/app/projects/?id=${instance.Project}`,
				type: 'link'
			}
		};
	};


	let resourcePath = '/quote_builder/quote';
	let detailModalConfig = {
		type: 'Quote',
		identityField: 'name',
		fields: [
			{
				key: 'name',
				title: 'Quote Name',
				type: 'text',
				required: true
			},
			{
				key: 'Project',
				title: 'Project',
				type: 'dropdown',
				items: {
					service: getCrudService('/quote_builder/project'),
					keyField: 'name'
				},
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
			key: 'projectLink',
			value: 'Project',
			// link: "/app/projects/{Project.id}" // TODO
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
					<BreadcrumbItem href="/app/quotes">Quotes</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable {resourcePath} headers={crudTableHeaders} title="Quotes" {detailModalConfig} DetailModal={BaseDetailModal} {toRepresentation}/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
