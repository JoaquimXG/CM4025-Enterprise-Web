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
	import { onMount } from 'svelte';
	import getCrudService from '$lib/services/CrudService';
	import Toast from './notifications/Toast.svelte';

	export let resourcePath = '';
	export let title = '';
	export let description = null;
	export let headers;
	export let pageSize = 5;
	export let page = 1;
	export let DetailModal = null;
	export let toRepresentation = (o) => o; // By default, just return the object, don't mutate for representation

	const CrudService = getCrudService(resourcePath);
	let objects = undefined;
	export let detailModalConfig = {};

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
		if (result.ok) objects = (await result.json()).map((o) => toRepresentation(o));
		else {
			objects = [];
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
			toastConfig.caption = result._fetchError
				? `Please try again: ${result.error}`
				: `${result.status}: ${result.statusText}`;
			toastConfig.show = true;
		}
	};

	const performUpdate = async (e) => {
		if (objects === undefined) return;
		let index = objects.findIndex((o) => o.id === e.detail.id);
		objects[index] = toRepresentation(e.detail);
		objects = objects;
	};

	const performCreate = async (e) => {
		if (objects === undefined) objects = [e.detail];
		else objects = [...objects, toRepresentation(e.detail)];
	};

	const startEdit = (row) => {
		detailModalConfig.show = true;
		detailModalConfig.mode = 'edit';
		detailModalConfig.instance = row;
		detailModalConfig.buttonStatus = 'dormant';
	};

	const startCreate = () => {
		detailModalConfig.show = true;
		detailModalConfig.mode = 'create';
		detailModalConfig.instance = {};
		detailModalConfig.buttonStatus = 'dormant';
	};
</script>

<Toast {...toastConfig} />

{#if detailModalConfig.show}
	<DetailModal
		on:updated={performUpdate}
		on:created={performCreate}
		on:toast={(e) => (toastConfig = { ...toastConfig, ...e.detail })}
		{...detailModalConfig}
	/>
{/if}

<Row>
	<Column>
		{#if objects === undefined}
			<DataTableSkeleton {headers} />
			<PaginationSkeleton />
		{:else}
			<DataTable
				class="crud-table"
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
							<OverflowMenuItem text="Edit" on:click={() => startEdit(row)} />
							<OverflowMenuItem danger text="Delete" on:click={() => performDelete(row)} />
						</OverflowMenu>
					{:else}{cell.value}{/if}
				</svelte:fragment>
				<Toolbar>
					<ToolbarContent>
						<Button on:click={startCreate}>Create</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
			<Pagination bind:pageSize bind:page totalItems={objects.length} pageSizeInputDisabled />
		{/if}
	</Column>
</Row>

<style>
	/* Set width of the last column in CRUD table to 50px. This column is only used for the menu */
	:global(.crud-table table tr > td:last-of-type) {
		width: 50px;
	}
</style>
