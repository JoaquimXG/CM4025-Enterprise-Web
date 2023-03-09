<script>
	import { ArrowRight } from 'carbon-icons-svelte';
	import { InlineLoading, Button } from 'carbon-components-svelte';

	const statusDescriptionMap = {
		active: 'Submitting...',
		finished: 'Success',
		inactive: 'Cancelling...',
		error: 'Error'
	};

	export let status = 'dormant'; // "dormant" | "active" | "finished" | "inactive"
	export let icon = ArrowRight;
  export let type = "submit"
</script>

{#if status !== 'dormant'}
	<InlineLoading
		class="stateful-loading-button"
		{status}
		description={statusDescriptionMap[status]}
	/>
{:else}
	<Button {type} class="button-confirm" {icon}>Login</Button>
{/if}


<style>
  :global(.stateful-loading-button) {
    min-height: 3rem !important; /*matches button height; important to override package default*/
  }
</style>