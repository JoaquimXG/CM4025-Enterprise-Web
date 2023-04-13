<script>
	import { Content, Grid, Row, Column, Breadcrumb, BreadcrumbItem, SkeletonText } from 'carbon-components-svelte';
	import AuthService from '$lib/services/AuthService.js';
	import UserContext from '$lib/contexts/UserContext.js';
	import { onMount, getContext } from 'svelte';

	AuthService.initContext();
	const { isAuthenticated, ready } = getContext(UserContext);
	let show = false;

	onMount(async () => {
		await ready;
		// Redirect user if not logged in
		if (!isAuthenticated()) AuthService.redirectNotAuthedUser();
		console.log(isAuthenticated());
		show = true;
	});
</script>

<Content>
	<Grid fullWidth style="padding: 0;">
		<Breadcrumb noTrailingSlash aria-label="Page navigation">
			<BreadcrumbItem href="/app">Dashboard</BreadcrumbItem>
		</Breadcrumb>
		<Row>
			<Column md={1} />
			<Column class="app-dashboard__content">
				{#if show}
					<h1>Quote Builder</h1>

					<h2>Overview</h2>

					<p>
						Welcome to Quote Builder, the ultimate project management tool for your company's
						internal use. With Quote Builder, you can easily create projects, assign quotes, and
						track tasks to keep your team organized and on track. Here's how to get started:
					</p>

					<h2>Usage</h2>
					<ol>
						<li>
							Create a project: To begin, navigate to projects on the left and create a new project
							using the 'create' button.
						</li>
						<li>
							Add a quote: Once you've created a project, navigate to quotes on the left and add a
							quote, using the 'create' button. You can assign your quote to the project created
							before.
						</li>
						<li>
							Create tasks: Once you've created a project, navigate to tasks on the left and create
							a task using the 'create' button. Pick a task name and associate it with your quote.
						</li>
						<li>
							Assign time entries: Once you've created a task, navigate to time entries on the left
							and assign a time entries to your team members for the task by picking a worker and an
							amount of time and assigning it to your task. The maximum time entry for each
							individual entry is 24 hours. If the class of worker you require is not available,
							please speak with your manager so an admin can add the worker along with thei hourly
							rate. You can view the available workers by selecting workers on the left.
						</li>
						<li>
							Add static costs: You can also associated one off static costs to a quote by
							navigating to static costs on the left and adding a static cost using the 'create'
							button.
						</li>
						<li>
							Calculate project/quote/task cost: Once you've created a project, quote, task, and
							time entry you can calculate the cost of a project, quote, or task by selecting the
							overflow menu in the row for the item and selecting 'Get Cost'.
						</li>
					</ol>

					<p>
						Keep it secure: Quote Builder is an internal tool, so you can be sure that your data is
						secure and confidential. By following these steps, you can streamline your project
						management process and get your team working more efficiently than ever before. Try
						Quote Builder today, start be selecting projects on the left
					</p>

					<p>
						You can also edit your profile details, select the profile icon and menu option in the
						top right
					</p>
				{:else}
				<SkeletonText class="h1" heading />
				<SkeletonText class="h2" heading />
				<SkeletonText class="p" paragraph lines={30} />
				{/if}
			</Column>
			<Column md={1} />
		</Row>
	</Grid>
</Content>

<style>
	:global(.app-dashboard__content) {
		max-width: 800px !important;
		/* padding: 'spacing-05'; */
	}
	h1, :global(.h1) {
		margin-top: 'spacing-07';
	}
	h2, :global(.h2) {
		margin-bottom: 'spacing-05';
		margin-top: 'spacing-07';
	}
	p, :global(.p) {
		font: 'body-long-02';
		/* margin-top: 'spacing-03'; */
		margin-bottom: 'spacing-03';
	}

	ol {
		font: 'body-long-02';
		list-style: decimal;
		margin-left: 'spacing-05';
	}

	li {
		margin-bottom: 'spacing-03';
	}
</style>
