<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import getCrudService from '$lib/services/CrudService';
	const minutesFormatter = (minutes) => {
		/*
		 * Converts minutes to HH:MM format
		 */
		if (minutes === undefined) return minutes;
		let seconds = minutes % 60;
		return `${Math.floor(minutes / 60)}:${seconds > 9 ? seconds : '0' + seconds}`;
	};
	const toRepresentation = (instance) => {
		return { ...instance, time: minutesFormatter(instance.minutes) };
	};

	const minutesToInternalValue = (time) => {
		// Check if : in time, split into hh:mm and convert to minutes
		// else, assume minutes
		if (time.includes(':')) {
			let [hh, mm] = time.split(':');
			return parseInt(hh) * 60 + parseInt(mm);
		} else {
			return parseInt(time);
		}
	};

	let resourcePath = '/quote_builder/time_entry';
	let detailModalConfig = {
		type: 'Time Entry',
		identityField: 'name',
		toRepresentation: (instance) => {
			return { ...instance, minutes: minutesFormatter(instance.minutes) };
		},
		toInternalValue: (instance) => {
			return { ...instance, minutes: minutesToInternalValue(instance.minutes) };
		},
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
				key: 'minutes',
				title: 'Time',
				type: 'time',
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
			key: 'time', // Formatted // TODO I think we should just use minutes instead
			value: 'Time (HH:MM)'
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
			{toRepresentation}
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
