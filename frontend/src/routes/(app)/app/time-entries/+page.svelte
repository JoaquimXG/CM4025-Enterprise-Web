<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import getCrudService from '$lib/services/CrudService';
	const secondsFormatter = (seconds) => {
		if (seconds > 3600) return new Date(seconds * 1000).toISOString().substring(11, 19);
		else return new Date(seconds * 1000).toISOString().substring(14, 19);
	};
	const formatter = (instance) => {
		return { ...instance, _seconds: secondsFormatter(instance.seconds) };
	};

	let resourcePath = '/quote_builder/time_entry';
	let detailModalConfig = {
		type: 'Time Entry',
		identityField: 'name',
		fields: [
			{
				key: 'Worker',
				title: 'Worker',
				type: 'dropdown',
				required: true,
				items: {
					service: getCrudService('/quote_builder/worker'),
					keyField: 'title'
				}
			},
			{
				key: 'Task',
				title: 'Task',
				type: 'dropdown',
				required: true,
				items: {
					service: getCrudService('/quote_builder/task'),
					keyField: 'name'
				}
			},
			{
				key: 'seconds',
				title: 'Time',
				type: 'text',
				required: true
			}
		],
		resourcePath
	};
	let crudTableHeaders = [
		{
			key: 'Worker',
			value: 'Worker'
		},
		{
			key: 'Task',
			value: 'Task'
		},
		{
			key: '_seconds', // Formatted
			value: 'Time'
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
					<BreadcrumbItem href="/app/tasks">Time Entries</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable
			{resourcePath}
			headers={crudTableHeaders}
			title="Time Entries"
			{detailModalConfig}
			DetailModal={BaseDetailModal}
			{formatter}
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
