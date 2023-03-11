<script>
	import settings from '$lib/settings/';
	import FloatingCenteredLayout from '$lib/layout/FloatingCenteredLayout.svelte';
	import {
		Row,
		Column,
		FluidForm,
		TextInput,
		Checkbox,
		PasswordInput
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import UserContext from '$lib/contexts/UserContext';
	import AuthService from '$lib/services/AuthService.js';
	import Toast from '$lib/components/notifications/Toast.svelte';
	import { onMount, getContext } from 'svelte';
	import StatefulButton from '$lib/components/StatefulButton.svelte';

	let { isAuthenticated, ready } = getContext(UserContext);

	let email = '';
	let password = '';
	let saveEmail = false;
	let buttonStatus = 'dormant';
	let toastConfig = {
		kind: 'error',
		title: 'Error',
		subtitle: 'Login Failed',
		caption: 'Please try again',
		show: false,
		timeout: 3000
	};

	const performLogin = async (e) => {
		//Attempt to login and respond to user accordingly via button and toast
		buttonStatus = 'active';
		let success = await AuthService.login(e, { email, password, saveEmail });
		if (success) buttonStatus = 'finished';
		else {
			toastConfig.show = true;
			buttonStatus = 'error';
			setTimeout(() => {
				buttonStatus = 'dormant';
			}, 1000);
		}
	};


	onMount(async () => {
		await ready;
		// Redirect user if already logged in
		if (isAuthenticated()) AuthService.redirectAuthedUser();

		// Get email from local storage, if set
		let localEmail = localStorage.getItem(settings.emailLocalStoreKey);
		if (localEmail) email = localEmail;
	});
</script>

<Toast {...toastConfig} />

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
				<Column sm={2}>
					<Checkbox
						class="form__row-checkbox__checkbox"
						bind:checked={saveEmail}
						labelText="Remember email?"
					/>
				</Column>
			</Row>
			<Row class="row-button-confirm">
				<Column sm={{ offset: 2, span: 2 }}>
					<StatefulButton type="submit" status={buttonStatus} icon={ArrowRight}
						>Login</StatefulButton
					>
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

	:global(.form__row-checkbox__checkbox) {
		padding-top: 'spacing-04';
		padding-left: 'spacing-04';
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}

	:global(.row-button-confirm .button-confirm__loading) {
		min-height: 3rem;
	}

	:global(.row-button-confirm .button-confirm) {
		max-width: unset;
		width: 100%;
	}
</style>
