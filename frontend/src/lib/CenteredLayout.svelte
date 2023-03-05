<script>
	import { Content, Grid, Row } from 'carbon-components-svelte';
</script>

<div class="center">
	<Grid>
		<Row>
			<slot />
		</Row>
	</Grid>
</div>

<style>
	:global(html, body, .center-content) {
		height: 100vh;
		width: 100vw;
	}

	:global(.bx--grid) {
		width: 100%;
	}

	.center {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: "spacing-07"
	}
</style>
