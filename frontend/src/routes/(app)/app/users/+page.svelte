<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import CrudTable from '$lib/components/CrudTable.svelte';
	import BaseDetailModal from '$lib/components/detailModals/BaseDetailModal.svelte';
	import UserContext from '$lib/contexts/UserContext';

	import { onMount, getContext } from 'svelte';
	import AuthService from '$lib/services/AuthService';

	const { isAdmin, ready } = getContext(UserContext);

	onMount(async () => {
		await ready;
		if (!isAdmin()) AuthService.redirectNotAuthedUser();
	});

	const toRepresentation = (instance) => {
		return {
			...instance,
			_isAdmin: instance.isAdmin ? 'Yes' : 'No',
			name: `${instance.firstName} ${instance.lastName}`
		};
	};

	let resourcePath = '/auth/user';
	let detailModalConfig = {
		type: 'User',
		identityField: 'email',
		fields: [
			{
				key: 'email',
				title: 'Email',
				type: 'text',
				required: true
			},
			{
				key: 'firstName',
				title: 'First Name',
				type: 'text',
				required: true
			},
			{
				key: 'lastName',
				title: 'Last Name',
				type: 'text',
				required: true
			},
			{
				key: 'isAdmin',
				title: 'Is Admin?',
				type: 'text',
			}
		],
		resourcePath
	};
	let crudTableHeaders = [
			{
				key: 'email',
				value: 'Email',
			},
			{
				key: 'name',
				value: 'Full Name',
			},
			{
				key: '_isAdmin',
				value: 'Is Admin?',
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
					<BreadcrumbItem href="/app/quotes">Users</BreadcrumbItem>
				</Breadcrumb>
			</Column>
		</Row>

		<CrudTable
			{resourcePath}
			headers={crudTableHeaders}
			title="Users"
			{detailModalConfig}
			DetailModal={BaseDetailModal}
			{toRepresentation}
			adminOrReadOnly
			crudConfig={{
				create: false,
				edit: true,
				delete: true
			}}
		/>
	</Grid>
</Content>

<style>
	:global(.row-header) {
		margin-bottom: 'spacing-03';
	}
</style>
