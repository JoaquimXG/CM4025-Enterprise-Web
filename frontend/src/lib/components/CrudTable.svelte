<script>
	import {
		DataTable,
		OverflowMenu,
		OverflowMenuItem,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
		Pagination,
		PaginationSkeleton,
		Link
	} from 'carbon-components-svelte';
	import { onMount, getContext } from 'svelte';
	import getCrudService from '$lib/services/CrudService';
	import UserContext from '$lib/contexts/UserContext';
	import Toast from './notifications/Toast.svelte';

	export let resourcePath = '';
	export let title = '';
	export let description = null;
	export let headers;
	export let pageSize = 5;
	export let page = 1;
	export let DetailModal = null;
	export let overflowConfig = {};
	export let toRepresentation = (o) => o; // By default, just return the object, don't mutate for representation
	export let adminOrReadOnly = false;
	export let crudConfig = {
		create: true,
		edit: true,
		delete: true
	};
	export let detailModalConfig = {};

	const { isAdmin: _isAdmin, ready } = getContext(UserContext);

	const CrudService = getCrudService(resourcePath);
	let objects = undefined;

	// TODO - move this to a separate file
	const defaultToastConfig = {
		kind: 'error',
		title: 'Error',
		subtitle: '',
		caption: 'Please try again',
		show: false,
		timeout: 3000,
		lowContrast: false
	};
	let toastConfig = defaultToastConfig;

	onMount(async () => {
		// If adminOrReadOnly is true, check if user is admin, and set crudtable to be read only if not
		await ready;
		if (adminOrReadOnly && !_isAdmin()) crudConfig = { create: false, edit: false, delete: false };

		// Load objects for table
		let result = await CrudService.list();
		if (result.ok) {
			objects = (await result.json()).map((o) => toRepresentation(o));
			editOnMount();
		} else {
			objects = [];
			toastConfig = {
				...defaultToastConfig,
				subtitle: `Failed to load ${title.toLowerCase()}`,
				caption: result._fetchError
					? `Please try again: ${result.error}`
					: `${result.status}: ${result.statusText}`,
				show: true
			};
		}
	});

	const editOnMount = () => {
		// Check for id in query params, and if present, open edit modal
		let urlParams = new URLSearchParams(window.location.search);
		let id = urlParams.get('id');
		if (id) {
			id = parseInt(id);
			let instance = objects.find((o) => o.id === id);
			startEdit(instance);
		}
	};

	const performDelete = async (row) => {
		let result = await CrudService.delete(row.id);
		if (result.ok) {
			objects = objects.filter((o) => o.id !== row.id);
			toastConfig = {
				...defaultToastConfig,
				kind: 'success',
				title: 'Success',
				subtitle: `Deleted ${title.toLowerCase()}`,
				caption: '',
				show: true
			};
		} else {
			toastConfig = {
				...defaultToastConfig,
				subtitle: `Failed to delete object`,
				caption: result._fetchError
					? `Please try again: ${result.error}`
					: `${result.status}: ${result.statusText}`,
				show: true
			};
		}
	};

	const performUpdate = async (e) => {
		if (objects === undefined) return;
		let index = objects.findIndex((o) => o.id === e.detail.id);
		objects[index] = toRepresentation(e.detail);
		objects = objects;
		toastConfig = {
			...defaultToastConfig,
			kind: 'success',
			title: 'Success',
			subtitle: `Updated ${title.toLowerCase()}`,
			caption: `View the ${title.toLowerCase()} in the table below`,
			show: true
		};
	};

	const performCreate = async (e) => {
		if (objects === undefined) objects = [toRepresentation(e.detail)];
		else objects = [...objects, toRepresentation(e.detail)];
		toastConfig = {
			...defaultToastConfig,
			kind: 'success',
			title: 'Success',
			subtitle: `Created ${title.toLowerCase()}`,
			caption: `View the ${title.toLowerCase()} in the table below`,
			show: true
		};
	};

	const performGetCost = async (row) => {
		let response = await CrudService.total(row.id);
		if (response.ok) {
			let index = objects.findIndex((o) => o.id === row.id);
			let cost = (await response.json()).total;
			// Round to 2 decimal places
			objects[index].cost = Math.round(cost * 100) / 100;
			objects = objects;
		} else {
			toastConfig = {
				...defaultToastConfig,
				subtitle: `Failed to get cost`,
				caption: result._fetchError
					? `Please try again: ${result.error}`
					: `${result.status}: ${result.statusText}`,
				show: true
			};
		}
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
					<OverflowMenuItem text="Edit" disabled={!crudConfig.edit} on:click={() => startEdit(row)} />
					{#if overflowConfig && overflowConfig.getCost}
						<OverflowMenuItem text="Get cost" on:click={() => performGetCost(row)} />
					{/if}
					<OverflowMenuItem
						disabled={!crudConfig.delete}
						danger
						text="Delete"
						on:click={() => performDelete(row)}
					/>
				</OverflowMenu>
			{:else if typeof cell.value === 'object' && cell.value.type === 'link'}
				<!-- If cell value is of type object, then we handle it differently. Currently we only handle links  -->
				<Link href={cell.value.link}>{cell.value.value}</Link>
			{:else}{cell.value}{/if}
		</svelte:fragment>
		<Toolbar>
			<ToolbarContent>
				<Button disabled={!crudConfig.create} on:click={startCreate}>Create</Button>
			</ToolbarContent>
		</Toolbar>
	</DataTable>
	<Pagination bind:pageSize bind:page totalItems={objects.length} pageSizeInputDisabled />
{/if}

<style>
	/* Set width of the last column in CRUD table to 50px. This column is only used for the menu */
	:global(.crud-table table tr > td:last-of-type) {
		width: 50px;
	}
</style>
