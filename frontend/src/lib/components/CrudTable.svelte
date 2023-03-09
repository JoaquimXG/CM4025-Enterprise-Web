<script>
	import {
		Row,
		Column,
		DataTable,
		OverflowMenu,
		OverflowMenuItem,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
		Pagination,
		PaginationSkeleton
	} from 'carbon-components-svelte';

	export let resourcePath = '';
	export let title = '';
	export let description = null;
	export let headers = [
		// {
		// 	key: 'id',
		// 	value: 'ID'
		// },
		{
			key: 'name',
			value: 'Name'
		},
		{
			key: 'cost',
			value: 'Cost'
		},
		{
			key: 'overflow',
			empty: true
		}
	];
	export let pageSize = 5;
	export let page = 1;

	import { onMount } from 'svelte';
	import getCrudService from '$lib/services/CrudService';
	import Toast from './notifications/Toast.svelte';
	const CrudService = getCrudService(resourcePath);
	let objects = [];

	let toastConfig = {
		kind: 'error',
		title: 'Error',
		subtitle: '',
		caption: 'Please try again',
		show: false,
		timeout: 3000,
		lowContrast: false
	};

	onMount(async () => {
		let result = await CrudService.list();
		if (result.ok) objects = await result.json();
		else {
			toastConfig.subtitle = `Failed to load ${title.toLowerCase()}`;
			toastConfig.caption = result._fetchError
				? `Please try again: ${result.error}`
				: `${result.status}: ${result.statusText}`;
			toastConfig.show = true;
		}
	});

	const performDelete = async (row) => {
		let result = await CrudService.delete(row.id);
		if (result.ok) {
			objects = objects.filter((o) => o.id !== row.id);
		} else {
			toastConfig.subtitle = `Failed to delete object`;
			console.log(result.error);
			toastConfig.caption = result._fetchError
				? `Please try again: ${result.error}`
				: `${result.status}: ${result.statusText}`;
			toastConfig.show = true;
		}
	};
</script>

<Toast {...toastConfig} />

<!-- TODO(IMPORTANT) Breakpoints to remove columns on smaller screens -->
<Row>
	<Column>
		{#if objects.length === 0}
			<DataTableSkeleton {headers} />
			<PaginationSkeleton />
		{:else}
			<DataTable
				{title}
				description={description ? description : `View and edit ${title.toLowerCase()}`}
				{headers}
				rows={objects}
				{pageSize}
				{page}
				sortable
			>
				<svelte:fragment slot="cell" let:cell let:row>
					{#if cell.key === 'overflow'}
						<OverflowMenu flipped>
							<OverflowMenuItem text="Edit" />
							<OverflowMenuItem danger text="Delete" on:click={() => performDelete(row)} />
						</OverflowMenu>
					{:else}{cell.value}{/if}
				</svelte:fragment>
				<Toolbar>
					<ToolbarContent>
						<Button>Create</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
			<Pagination bind:pageSize bind:page totalItems={objects.length} pageSizeInputDisabled />
		{/if}
	</Column>
</Row>
