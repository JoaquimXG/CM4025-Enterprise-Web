<script>
	import { Content, Grid, Row, Column, Button } from 'carbon-components-svelte';
</script>

<Content style="padding: 0">
	<Grid padding={true} class="landing-page-grid">
		<Row class="landing-page-background landing-page__banner">
			<Column lg={16}>
				<h1>XJG - Quote Builder</h1>
				<p class="landing-page__subtext">
					Create Projects, build quotes, assign tasks, and calculate costs; all in on place.
				</p>
			</Column>
		</Row>

		<Row class="landing-page__r2">
			<Column>
				<Row class="landing-page__content">
					<Column md={4} lg={7}>
						<h2>What is Quote Builder?</h2>
						<p>
							Quote builder is our leading platform for estimating project costs. Projects are
							broken down into individual quotes, each having their own tasks and static costs. The
							total cost of can be be calculated both for projects and individual quotes.
						</p>
						<Button href="/auth/login/">Log in</Button>
					</Column>
					<Column md={4} lg={{ span: 8, offset: 1 }}>
						<img alt="Carbon illustration" src="/tab-illo.png" />
						<!-- TODO(IMPORTANT) Replace image, and alt -->
					</Column>
				</Row>
			</Column>
		</Row>
	</Grid>
</Content>

<style>
	h1 {
		font: 'productive-heading-05';
	}

	p {
		font: 'productive-heading-03';
		margin-top: 'spacing-06';
		margin-bottom: 'spacing-08';
	}

	:global(.bx--grid) {
		position: relative;
		z-index: 1;
	}

	:global(.landing-page__r2 .bx--tabs__nav) {
		right: 0;
	}

	:global(.landing-page-background) {
		position: relative;
		background-color: 'ui-01';
	}

	:global(.landing-page-background::before) {
		content: '';
		position: absolute;
		z-index: -1;
		top: 0;
		bottom: 0;
		right: -'spacing-05';
		left: -'spacing-05';
		background: 'ui-01';
	}

	img {
		max-width: 100%;
	}

	:global(.landing-page__banner) {
		padding-top: 'spacing-05';
		padding-bottom: 'spacing-07';
	}

	:global(.landing-page__r2) {
		margin-top: rem(-40px);
	}

	:global(.landing-page__content) {
		font: 'body-long-02';
		padding-top: 'spacing-10';
		padding-bottom: 'spacing-10';
	}

	@media (between: 321px) and (md) {
		p {
			max-width: 75%;
		}
	}
</style>
