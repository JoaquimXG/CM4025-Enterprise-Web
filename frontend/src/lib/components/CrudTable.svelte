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
	const CrudService = getCrudService(resourcePath);
	let objects = [];

	onMount(async () => {
		try {
			let o = await CrudService.list();
      console.log(o)
			if (o) objects = o;
		} catch (error) {}
	});

</script>
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
				<svelte:fragment slot="cell" let:cell>
					{#if cell.key === 'overflow'}
						<OverflowMenu flipped>
							<OverflowMenuItem text="Edit" />
							<OverflowMenuItem danger text="Delete" />
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
