<script>
	import {
		Grid,
		Content,
		Row,
		Column,
		Button,
		FluidForm,
		TextInput,
		Breakpoint,
		Modal
	} from 'carbon-components-svelte';
	import { ArrowRight, TrashCan } from 'carbon-icons-svelte';
	import AuthService from '$lib/services/AuthService.js';
	import getCrudService from '$lib/services/CrudService';
	import UserContext from '$lib/contexts/UserContext.js';
	import { getContext, onMount } from 'svelte';
	import Toast from '$lib/components/notifications/Toast.svelte';
	import ToastService from '$lib/services/ToastService';

	const { User, isAuthenticated, ready } = getContext(UserContext);
	const UserService = getCrudService('/auth/user');

	let email = '';
	let firstName = '';
	let lastName = '';
	let size = '';
	let confirmDelete = false;
	let toastConfig = ToastService.init();

	onMount(async () => {
		await ready;
		if (!isAuthenticated()) return AuthService.redirectNotAuthedUser();
		if ($User) {
			email = $User.email;
			firstName = $User.firstName;
			lastName = $User.lastName;
		}
	});

	const performDelete = async () => {
		let response = await UserService.delete('me');
		if (response.ok) window.location.href = '/auth/login';
		else toastConfig = ToastService.getError({ subtitle: 'Failed to delete account' });
	};

	const performUpdate = async (e) => {
		e.preventDefault();
		let response = await UserService.update('me', {
			email,
			firstName,
			lastName
		});
		if (response.ok) {
			let user = await response.json();
			User.set(user);
			toastConfig = ToastService.getSuccess({
				subtitle: 'Profile updated',
				caption: 'Your profile has been updated'
			});
		} else {
			toastConfig = ToastService.getErrorFromResponse({
				subtitle: 'Failed to update profile',
				response
			});
		}
	};
</script>

<Toast {...toastConfig} />

<Breakpoint bind:size />

<Modal
	class="profile__modal"
	bind:open={confirmDelete}
	modalHeading={'Are you sure you want to delete your account?'}
	primaryButtonText="Confirm"
	primaryButtonIcon={TrashCan}
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (confirmDelete = false)}
	on:open
	on:close
	on:submit={performDelete}
/>

<Grid>
	<Content>
		<Row class="profile__row-header">
			<Column>
				<h1>Update Profile</h1>
			</Column>
		</Row>
		<Row class="row-form">
			<FluidForm on:submit={performUpdate} class="fill">
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
					<Column class="profile__column-button">
						<Button
							kind="danger-tertiary"
							iconDescription="Delete"
							icon={TrashCan}
							on:click={() => (confirmDelete = true)}
						/>
						<Button type="submit" icon={ArrowRight}>Update</Button>
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
	:global(.profile__column-button) {
		margin-top: 'spacing-05';
		justify-content: space-between;
		display: flex;
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}
</style>
