<script>
	/**
	 * Wrapper for the Carbon ToastNotification component.
	 * Just helps to position properly.
	 */
	import { ToastNotification} from 'carbon-components-svelte';

	export let kind = 'info';
	export let title = '';
	export let subtitle = '';
	export let caption = ''
	export let lowContrast = true;
	export let show = true;
  export let timeout = 2500;
</script>

{#if show}
	<ToastNotification
		class="toast"
		{kind}
		{title}
		{subtitle}
		on:close={() => (show = false)}
		{lowContrast}
    {timeout}
		{caption}
	/>
{/if}


<style>
  :global(.toast) {
    position: fixed;
    top: 'spacing-10';
    right: 0;
		z-index: 1000;
  }
</style>