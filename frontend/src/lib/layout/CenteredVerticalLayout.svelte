<script>
	import { Grid, Row, Content } from 'carbon-components-svelte';
</script>

<div class="center">
	<Content class="centered-vertical__content">
		<Grid>
			<Row>
				<slot />
			</Row>
		</Grid>
	</Content>
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

	:global(.centered-vertical__content) {
		padding: 0 !important; /*Using important to override package default*/
	}
</style>
