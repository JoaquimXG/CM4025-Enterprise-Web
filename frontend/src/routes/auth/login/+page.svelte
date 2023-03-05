<script>
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
	
	import LoginService from '$lib/services/LoginService.js';
	LoginService
</script>

<FloatingCenteredLayout>
	<Row class="row-header">
		<Column>
			<h1>Login</h1>
			<p>Don't have an account? <a href="/auth/register">Register</a></p>
		</Column>
	</Row>
	<Row class="row-form">
		<FluidForm class="fill">
			<TextInput class="input-email" labelText="Email" placeholder="Enter email..." required />
			<PasswordInput
				required
				type="password"
				labelText="Password"
				placeholder="Enter password..."
			/>
			<Row class="form__checkbox">
				<Column sm={2}>
					<Checkbox labelText="Remember email?" />
				</Column>
			</Row>
			<Row>
				<Column sm={{ offset: 2, span: 2 }}>
					<Button class="button-confirm fill" icon={ArrowRight}>Register</Button>
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
		padding-left: 'spacing-03';
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}
</style>
