<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import UserContext from '$lib/contexts/UserContext';

	import { onMount, getContext } from 'svelte';

	const { isAdmin: _isAdmin, ready } = getContext(UserContext);
	let isAdmin = false;

	onMount(async () => {
		await ready;
		isAdmin = _isAdmin();
	});

	const toRepresentation = (instance) => {
		return {
			...instance,
			projectLink: {
				value: instance._projectName,
				link: `/app/projects/?id=${instance.Project}`,
				type: 'link'
			},
			cost: '--'
		};
	};

	let resourcePath = '/quote_builder/worker';
	let detailModalConfig = {
		type: 'Worker',
		identityField: 'title',
		fields: [
			{
				key: 'title',
				title: 'Job title',
				type: 'text',
				required: true
			},
			{
				key: 'rate',
				title: 'Hourly Rate (£)',
				type: 'number',
				required: true
			}
		],
		resourcePath
	};
	let crudTableHeaders = [
		{
			key: 'title',
			value: 'Job Title'
		},
		{
			key: 'rate',
			value: 'Hourly Rate (£)'
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
					<BreadcrumbItem href="/app/quotes">Workers</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable
			{resourcePath}
			headers={crudTableHeaders}
			title="Workers"
			{detailModalConfig}
			DetailModal={BaseDetailModal}
			{toRepresentation}
			adminOrReadOnly
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
