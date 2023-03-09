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
		PasswordInput,
		InlineLoading,
		ButtonSet
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';

	import AuthService from '$lib/services/AuthService.js';
	import Toast from '$lib/components/notifications/Toast.svelte';
	import { onMount } from 'svelte';
	let email = '';
	let password = '';
	let saveEmail = false;

	let toastConfig = {
		kind: 'error',
		title: 'Error',
		subtitle: 'Login Failed',
		show: false,
		timeout: 3000
	};

	const performLogin = async (e) => {
		state = 'active';
		let success = await AuthService.login(e, { email, password, saveEmail });
		if (success) {
			state = 'finished';
		} else {
			toastConfig.show = true;
			state = 'error';
			setTimeout(() => {
				state = 'dormant';
			}, 1000);
		}
	};

	onMount(async () => {
		// Redirect user if already logged in
		if (await AuthService.isAuthenticated()) AuthService.redirectAuthedUser();

		// Get email from local storage, if set
		let localEmail = localStorage.getItem(settings.emailLocalStoreKey);
		if (localEmail) email = localEmail;
	});

	const stateDescriptionMap = {
		active: 'Submitting...',
		finished: 'Success',
		inactive: 'Cancelling...',
		error: 'Error'
	};

	let state = 'dormant'; // "dormant" | "active" | "finished" | "inactive"
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
					{#if state !== 'dormant'}
						<InlineLoading
							class="button-confirm__loading"
							status={state}
							description={stateDescriptionMap[state]}
						/>
					{:else}
						<Button type="submit" class="button-confirm" icon={ArrowRight}>Login</Button>
					{/if}
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
