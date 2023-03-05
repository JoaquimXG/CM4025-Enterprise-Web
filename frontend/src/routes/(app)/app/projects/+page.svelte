<script>
	import { Row, Column, Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	import { onMount } from 'svelte';
	import getCrudService from '$lib/services/CrudService';
	const ProjectService = getCrudService('/quote_builder/project');
	let projects = [];

	onMount(async () => {
		try {
			let p = await ProjectService.list();
			if (p) projects = p;
		} catch (error) {}
	});
</script>

<Breadcrumb noTrailingSlash aria-label="Page navigation">
	<BreadcrumbItem href="/app">Dashboard</BreadcrumbItem>
	<BreadcrumbItem href="/app/projects">Projects</BreadcrumbItem>
</Breadcrumb>
<h1>View and edit projects</h1>


<pre>
  {#each projects as project}
    {project.name}
  {/each}
</pre>
