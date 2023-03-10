<script>
	// TODO allow editing reverse relations?
	import { Row, Column, TextInput, Modal, Form, Dropdown } from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import getCrudService from '$lib/services/CrudService';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import ValidationService from '$lib/services/ValidationService';
	import { Fields, Instance } from '$lib/stores/DetailModalStore';

	const dispatch = createEventDispatcher();

	export let show = false;
	export let type = '';
	export let identityField = '';
	export let instance;
	export let mode = 'create'; // create | edit
	export let fields;
	export let resourcePath;
	// export let buttonStatus = 'dormant'; // TODO reactivity for button
	const CrudService = getCrudService(resourcePath);
	let asyncItems = {};

	let title = mode === 'create' ? `Create ${type}` : `Edit ${type}: ${instance[identityField]}`;
	Fields.set(fields);
	Instance.set(instance);

	onMount(() => {
		fields.forEach(async (field) => {
			if (field.type === 'dropdown') {
				asyncItems[field.key] = await getDropdownItems(field);
				if (!instance[field.key]) instance[field.key] = -1;
			}
		});
	});

	const performCreate = async (object) => {
		console.log("Performing Create")
		if (!ValidationService.validate($Fields, object)) return;
		console.log("Validated")
		let result = await CrudService.create(object);
		if (result.ok) {
			dispatch('created', await result.json());
			show = false;
		} else {
			dispatch('toast', {
				kind: 'error',
				subtitle: `Failed to create ${type}`,
				show: true
			});
		}
	};

	const performUpdate = async (object) => {
		if (!ValidationService.validate($Fields, object)) return;
		let result = await CrudService.update(object.id, object);
		if (result.ok) {
			dispatch('updated', await result.json());
			show = false;
		} else {
			dispatch('toast', {
				kind: 'error',
				subtitle: `Failed to update ${type}: ${object[identityField]}`,
				show: true
			});
		}
	};

	const performSubmit = () => {
		if (mode === 'create') {
			performCreate($Instance);
		} else {
			performUpdate($Instance);
		}
	};
	$: console.log('Fields', $Fields);
	$: console.log('Object', $Instance);

	const getDropdownItems = async (field) => {
		let results = await field.items.service.list();
		if (results.ok) {
			let json = await results.json();
			let mapped = json.map((item) => ({
				id: item.id,
				text: item[field.items.keyField]
			}));
			return [{ id: -1, text: 'Please select', disabled: true }, ...mapped];
		} else {
			dispatch('toast', {
				kind: 'error',
				subtitle: `Failed to get items for ${field.title}`,
				show: true
			});
			return [{ id: -1, text: 'Failed to get items', disabled: true }];
		}
	};
</script>

<Modal
	class="modal"
	bind:open={show}
	modalHeading={title}
	primaryButtonText="Confirm"
	primaryButtonIcon={ArrowRight}
	secondaryButtonText="Cancel"
	selectorPrimaryFocus="#field-0"
	on:click:button--secondary={() => (show = false)}
	on:open={() => {
		Instance.set(instance)
		ValidationService.fillEmptyDropdowns($Fields, $Instance)
	}}
	on:close={() => {
		$Fields.forEach((field) => ValidationService.clearInvalid(field, $Fields));
	}}
	on:submit={performSubmit}
>
	<Row class="modal__row-form">
		<Column>
			<Form class="modal__form">
				{#each $Fields || [] as field, i}
					<Row class="modal__row-field">
						<Column>
							{#if field.type === 'dropdown'}
								<Dropdown
									on:blur={() =>
										ValidationService.validateField(field, $Instance[field.key], $Fields)}
									on:select={() => ValidationService.clearInvalid(field, $Fields)}
									style="height:100%"
									id={`field-${i}`}
									titleText={field.title}
									required={field.required ? true : false}
									class="modal__dropdown-field modal__field"
									items={asyncItems[field.key]}
									invalid={field.invalid}
									invalidText={field.invalidText}
									bind:selectedId={$Instance[field.key]}
								/>
							{:else if field.type === 'text'}
								<TextInput
									on:blur={() =>
										ValidationService.validateField(field, $Instance[field.key], $Fields)}
									on:input={() => ValidationService.clearInvalid(field, $Fields)}
									id={`field-${i}`}
									class="modal__input-field modal__field"
									labelText={field.title}
									required={field.required ? true : false}
									placeholder={`Enter ${field.title.toLocaleLowerCase()}...`}
									invalid={field.invalid}
									invalidText={field.invalidText}
									bind:value={$Instance[field.key]}
								/>
							{/if}
						</Column>
					</Row>
				{/each}
				<!-- // TODO sateteful button -->
			</Form>
		</Column>
	</Row>
</Modal>

<style>
	:global(.modal__form) {
		width: 100%;
		max-width: 100%;
	}

	:global(.modal__row-field) {
		margin-bottom: 'spacing-05';
	}

	:global(.modal__row-field:last-child) {
		margin-bottom: 0;
	}

	/* This is a hack to ensure that dropdowns in the modal don't require scrolling w
		within the modal to be viewed. It is scoped to only impact this modal*/
	:global(.modal .bx--modal-container) {
		overflow: visible;
	}
	:global(.modal .bx--modal-content) {
		overflow: visible;
	}
</style>
