<script>
	import { Grid, Row } from 'carbon-components-svelte';
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
		box-sizing: border-box;
		height: 100%;
		width: 100vw;
		overflow-x: hidden;
	}

	:global(.bx--grid) {
		width: 100%;
		box-sizing: border-box;
	}

	.center {
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
