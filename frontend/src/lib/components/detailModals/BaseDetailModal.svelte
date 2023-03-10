<script>
	// TODO allow editing reverse relations?
	import { Row, Column, TextInput, Modal, Form, Dropdown } from 'carbon-components-svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import getCrudService from '$lib/services/CrudService';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	const FIELD_TYPE_MAP = {
		text: TextInput,
		dropdown: Dropdown
	};

	const dispatch = createEventDispatcher();

	export let show = false;
	export let type = '';
	export let identityField = '';
	export let object = {};
	export let mode = 'create'; // create | edit
	export let fields = [];
	export let resourcePath;
	// export let buttonStatus = 'dormant'; // TODO reactivity for button
	const CrudService = getCrudService(resourcePath);
	let asyncItems = {};

	let title = mode === 'create' ? `Create ${type}` : `Edit ${type}: ${object[identityField]}`;

	onMount(() => {
		fields.forEach(async (field) => {
			if (field.type === 'dropdown') {
				asyncItems[field.key] = await getDropdownItems(field);
				console.log(asyncItems);
			}
		});
	});

	const performCreate = async (object) => {
		let result = await CrudService.create(object);
		if (result.ok) {
			let json = await result.json();
			dispatch('created', json);
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
		let result = await CrudService.update(object.id, object);
		if (result.ok) {
			let json = await result.json();
			dispatch('updated', json);
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
			performCreate(object);
		} else {
			performUpdate(object);
		}
	};
	const t = [
		{ id: 34, text: 'Test Project 1' },
		{ id: 37, text: 'This is a test' },
		{ id: 39, text: 'WOOO' },
		{ id: 45, text: 'WOO244' },
		{ id: 47, text: 'asdfasdfasdf' },
		{ id: 48, text: 'asdfasdf' }
	];

	const getDropdownItems = async (field) => {
		let results = await field.items.service.list();
		console.log(results);
		if (results.ok) {
			let json = await results.json();
			console.log(json);
			let mapped = json.map((item) => ({
				id: item.id,
				text: item[field.items.keyField]
			}));
			console.log(mapped);
			return mapped;
		} else {
			dispatch('toast', {
				kind: 'error',
				subtitle: `Failed to get items for ${field.title}`,
				show: true
			});
			return [];
		}
	};
</script>

<!-- selectedId={object[field.key]}
							bind:value={object[field.key]} TODO -->

<Modal
	bind:open={show}
	modalHeading={title}
	primaryButtonText="Confirm"
	primaryButtonIcon={ArrowRight}
	secondaryButtonText="Cancel"
	selectorPrimaryFocus="#field-0"
	on:click:button--secondary={() => (show = false)}
	on:open
	on:close
	on:submit={performSubmit}
>
	<Row class="modal__row-form">
		<Column>
			<Form class="modal__form">
				{#each fields as field, i}
					<Row>
						<Column>
							{#if field.type === 'dropdown'}
								<!-- {let items = getDropdownItems(field)} -->
								<Dropdown
									style="height:100%"
									id={`field-${i}`}
									titleText="WOOO"
									class="modal__dropdown-field modal__field"
									items={t}
									selectedId={object[field.key]}
								/>
							{:else if field.type === 'text'}
								<TextInput
									id={`field-${i}`}
									class="modal__input-field modal__field"
									labelText={field.title}
									placeholder={`Enter ${field.title.toLocaleLowerCase()}...`}
									bind:value={object[field.key]}
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

	:global(.model__row-form) {
		overflow: hidden;
	}
</style>
