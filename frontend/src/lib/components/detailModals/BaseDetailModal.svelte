<script>
	import {
		Row,
		Column,
		TextInput,
		Modal,
		Form,
		Dropdown,
		NumberInput,
		TimePicker
	} from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import getCrudService from '$lib/services/CrudService';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import ValidationService from '$lib/services/ValidationService';
	import { Fields, Instance } from '$lib/stores/DetailModalStore';
	import ToastService from '$lib/services/ToastService';

	export let show = false;
	export let type = '';
	export let identityField = '';
	export let instance;
	export let mode = 'create'; // create | edit
	export let fields;
	export let resourcePath;
	export let toInternalValue = (instance) => instance;
	export let toRepresentation = (instance) => instance;
	// export let buttonStatus = 'dormant'; // TODO(OUTOFSCOPE) reactivity for button like login page?

	const CrudService = getCrudService(resourcePath);
	const dispatch = createEventDispatcher();
	let asyncItems = {};
	let title = mode === 'create' ? `Create ${type}` : `Edit ${type}: ${instance[identityField]}`;
	Fields.set(fields);
	Instance.set(toRepresentation(instance));

	onMount(() => {
		fields.forEach(async (field) => {
			if (field.type === 'dropdown') {
				asyncItems[field.key] = await getDropdownItems(field);
				if (!instance[field.key]) instance[field.key] = -1;
			}
		});
	});

	const performCreate = async (object) => {
		if (!ValidationService.validate($Fields, object)) return;
		object = toInternalValue(object);
		let response = await CrudService.create(object);
		if (response.ok) {
			dispatch('created', await response.json());
			show = false;
		} else {
			dispatch(
				'toast',
				ToastService.getErrorFromResponse({
					subtitle: `Failed to create ${type}`,
					response
				})
			);

			if (!response._fetchError)
				ValidationService.getBackendFieldErrors(await response.json(), fields);
		}
	};

	const performUpdate = async (object) => {
		if (!ValidationService.validate($Fields, object)) return;
		object = toInternalValue(object);
		let response = await CrudService.update(object.id, object);
		if (response.ok) {
			dispatch('updated', await response.json());
			show = false;
		} else {
			dispatch(
				'toast',
				ToastService.getErrorFromResponse({
					subtitle: `Failed to update ${type}`,
					response
				})
			);
		}
	};

	const performSubmit = () => {
		if (mode === 'create') {
			performCreate($Instance);
		} else {
			performUpdate($Instance);
		}
	};

	const getDropdownItems = async (field) => {
		let response = await field.items.service.list();
		if (response.ok) {
			let json = await response.json();
			let mapped = json.map((item) => ({
				id: item.id,
				text: item[field.items.keyField]
			}));
			return [{ id: -1, text: 'Please select', disabled: true }, ...mapped];
		} else {
			dispatch(
				'toast',
				ToastService.getErrorFromResponse({
					subtitle: `Failed to get items for ${field.title}`,
					response
				})
			);

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
		Instance.set(toRepresentation(instance));
		ValidationService.fillEmptyDropdowns($Fields, $Instance);
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
									on:select={() => ValidationService.clearInvalid(field, $Fields)}
									style="height:100%"
									id={`field-${i}`}
									titleText={field.title}
									required={field.required ? true : false}
									class="modal__dropdown-field modal__field"
									items={asyncItems[field.key] || []}
									invalid={field.invalid}
									invalidText={field.invalidText}
									bind:selectedId={$Instance[field.key]}
								/>
							{:else if field.type === 'text'}
								<TextInput
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
							{:else if field.type === 'number'}
								<NumberInput
									allowEmpty={true}
									on:input={() => ValidationService.clearInvalid(field, $Fields)}
									id={`field-${i}`}
									class="modal__input-field modal__field"
									label={field.title}
									required={field.required ? true : false}
									placeholder={`Enter ${field.title.toLocaleLowerCase()}...`}
									invalid={field.invalid}
									invalidText={field.invalidText}
									bind:value={$Instance[field.key]}
								/>
							{:else if field.type === 'time'}
								<TimePicker
									on:input={() => ValidationService.clearInvalid(field, $Fields)}
									id={`field-${i}`}
									class="modal__time-field modal__field"
									labelText={field.title}
									required={field.required ? true : false}
									placeholder={`hh:mm`}
									invalid={field.invalid}
									invalidText={field.invalidText}
									bind:value={$Instance[field.key]}
								/>
							{/if}
						</Column>
					</Row>
				{/each}
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

	:global(.modal__time-field) {
		padding-right: 1rem !important;
	}
</style>
