<script>
	import settings from '$lib/settings/';
	import FloatingCenteredLayout from '$lib/layout/FloatingCenteredLayout.svelte';
	import {
		Row,
		Column,
		Button,
		FluidForm,
		TextInput,
		Checkbox,
		PasswordInput
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	import AuthService from '$lib/services/AuthService.js';
	import { onMount } from 'svelte';
	let email = '';
	let password = '';
	let saveEmail = false;

	const performLogin = async (e) => {
		let success = await AuthService.login(e, { email, password, saveEmail });
		if (!success) console.log('Login failed'); // TODO show detail to user
	};

	onMount(async () => {
		// Redirect user if already logged in
		if (await AuthService.isAuthenticated()) AuthService.redirectAuthedUser();

		// Get email from local storage, if set
		let localEmail = localStorage.getItem(settings.emailLocalStoreKey);
		if (localEmail) email = localEmail;
	});
</script>

<FloatingCenteredLayout>
	<Row class="row-header">
		<Column>
			<h1>Login</h1>
			<p>Don't have an account? <a href="/auth/register">Register</a></p>
		</Column>
	</Row>
	<Row class="row-form">
		<FluidForm on:submit={performLogin} class="fill">
			<TextInput
				class="input-email"
				labelText="Email"
				placeholder="Enter email..."
				required
				bind:value={email}
			/>
			<PasswordInput
				required
				type="password"
				labelText="Password"
				placeholder="Enter password..."
				bind:value={password}
			/>
			<Row>
				<Column class="form__checkbox" sm={2}>
					<Checkbox bind:checked={saveEmail} labelText="Remember email?" />
				</Column>
			</Row>
			<Row>
				<Column sm={{ offset: 2, span: 2 }}>
					<Button type="submit" class="button-confirm fill" icon={ArrowRight}>Login</Button>
				</Column>
			</Row>
		</FluidForm>
	</Row>
</FloatingCenteredLayout>

<style>
	h1 {
		margin-bottom: 'spacing-03';
	}

	:global(.row-header) {
		padding-top: 'spacing-07';
		padding-bottom: 'spacing-07';
	}

	:global(.input-password) {
		margin-bottom: 'spacing-10';
	}

	:global(.form__checkbox) {
		padding-top: 'spacing-03';
		margin-left: 'spacing-04';
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}
</style>
