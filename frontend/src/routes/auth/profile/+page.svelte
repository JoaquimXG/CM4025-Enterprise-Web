<script>
	import FloatingCenteredLayout from '$lib/layout/FloatingCenteredLayout.svelte';
	import {
		Grid,
		Content,
		Row,
		Column,
		Button,
		FluidForm,
		TextInput,
		PasswordInput
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	import AuthService from '$lib/services/AuthService.js';
	import getCrudService from '$lib/services/CrudService';
	const UserService = getCrudService('/auth/user');

	import { onMount } from 'svelte';
	let email = '';
	let firstName = '';
	let lastName = '';

	onMount(async () => {
		// Redirect user not logged in
		if (!(await AuthService.isAuthenticated())) AuthService.redirectNotAuthedUser();

		try {
			// TODO(IMPORTANT) need to be able to pass this through the app in context, loading multiple times per page is a mess
			let user = await UserService.retrieve('me');
			if (user) {
				email = user.email;
				firstName = user.firstName;
				lastName = user.lastName;
			}
		} catch (error) {}
	});
</script>

<Grid>
	<Content>
		<Row class="profile__row-header">
			<Column>
				<h1>Update Profile</h1>
			</Column>
		</Row>
		<Row class="row-form">
			<FluidForm
				on:submit={(e) => {
					e.preventDefault();
					UserService.update('me', {
						email,
						firstName,
						lastName
					});
				}}
				class="fill"
			>
				<Column class="form__sub-header">
					<p class="form__detail-header">Profile Details</p>
				</Column>
				<TextInput
					bind:value={firstName}
					labelText="First Name"
					placeholder="Enter first name..."
					required
				/>
				<TextInput
					bind:value={lastName}
					labelText="Last Name"
					placeholder="Enter last name..."
					required
				/>
				<Column class="form__sub-header form__splitter">
					<p class="form__detail-header">Login Details</p>
				</Column>
				<TextInput bind:value={email} labelText="Email" placeholder="Enter email..." required />
				<Row>
					<Column sm={{ offset: 2, span: 2 }}>
						<Button type="submit" class="button-confirm fill" icon={ArrowRight}>Update</Button>
					</Column>
				</Row>
			</FluidForm>
		</Row>
	</Content>
</Grid>

<style>
	:global(.profile__row-header) {
		padding-top: 'spacing-07';
		padding-bottom: 'spacing-07';
		border-bottom: 1px solid 'ui-04';
	}

	:global(.form__sub-header) {
		padding-bottom: 'spacing-05';
		padding-top: 'spacing-05';
	}

	:global(.form__detail-header) {
		font: 'productive-heading-02';
	}

	:global(.form__splitter) {
		padding-top: 'spacing-05';
	}

	:global(.button-confirm) {
		padding-bottom: 'spacing-05';
		padding-top: 'spacing-05';
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}
</style>
