<script>
	import FloatingCenteredLayout from '$lib/layout/FloatingCenteredLayout.svelte';
	import {
		Row,
		Column,
		Button,
		FluidForm,
		TextInput,
		PasswordInput
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
</script>

<FloatingCenteredLayout>
	<Row class="row-header">
		<Column>
			<h1>Register</h1>
			<p>Already have an account? <a href="/auth/login">Login</a></p>
		</Column>
	</Row>
	<Row class="row-form">
		<FluidForm class="fill">
			<Column class="form__sub-header">
			<p class="form__detail-header">Profile Details</p>
			</Column>
			<TextInput labelText="First Name" placeholder="Enter first name..." required />
			<TextInput labelText="Last Name" placeholder="Enter last name..." required />
			<Column class="form__sub-header form__splitter">
			<p class="form__detail-header">Login Details</p>
			</Column>
			<TextInput labelText="Email" placeholder="Enter email..." required />
			<PasswordInput
				required
				type="password"
				labelText="Password"
				placeholder="Enter password..."
			/>
			<PasswordInput
				required
				type="password"
				labelText="Confirm Password"
				placeholder="Enter password again..."
			/>
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
		border-bottom: 1px solid "ui-04";
	}

	:global(.form__checkbox) {
		padding-top: 'spacing-03';
		padding-left: 'spacing-03';
	}
	
	:global(.form__sub-header) {
		padding-bottom: 'spacing-05';
		padding-top: 'spacing-05';
	}
	
	:global(.form__detail-header) {
		font: "productive-heading-02";
	}
	
	:global(.form__splitter) {
		padding-top: 'spacing-05';
	}
	
	:global(.button-confirm){
		padding-bottom: 'spacing-05';
		padding-top: 'spacing-05';
	}

	:global(.fill) {
		width: 100%;
		max-width: 100%;
	}
</style>