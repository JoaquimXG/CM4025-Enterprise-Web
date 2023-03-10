<script>
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		Breakpoint
	} from 'carbon-components-svelte';
	import { Cost, Document, Hourglass, Roadmap, Task, TwoPersonLift } from 'carbon-icons-svelte';

	export let isSideNavOpen = true;
	let size;
</script>

<Breakpoint bind:size />

<SideNav bind:isOpen={isSideNavOpen} rail={size !== 'sm' ? true : false}>
	<SideNavItems>
		<SideNavLink href="/app/projects" icon={Roadmap} text="Projects" />
		<SideNavLink href="/app/quotes/" icon={Document} text="Quotes" />
		<SideNavLink href="/app/tasks/" icon={Task} text="Tasks" />
		<SideNavLink href="/app/time-entries" icon={Hourglass} text="Time Entries" />
		<SideNavLink href="/app/static-costs" icon={Cost} text="Static Costs" />
		<SideNavDivider />
		<SideNavLink href="/app/workers" icon={TwoPersonLift} text="Workers" />
	</SideNavItems>
</SideNav>
