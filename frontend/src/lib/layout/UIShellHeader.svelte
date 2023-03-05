<script>
	import {
		Header,
		SkipToContent,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink
	} from 'carbon-components-svelte';
	import { UserAvatarFilledAlt } from 'carbon-icons-svelte';

	import { onMount } from 'svelte';
	import AuthService from '$lib/services/AuthService.js';
  import getCrudService from '$lib/services/CrudService';
  const UserService = getCrudService('/auth/user');

	export let isSideNavOpen = false;
	export let isAuthenticated = false;

	let isProfileOpen = false;
	let isSwitcherOpen = false;
	let email = '<email>';

	onMount(async () => {
		try {
			// TODO(IMPORTANT) need to be able to pass this through the app in context, loading multiple times per page is a mess
			let user = await UserService.retrieve('me');
			if (user) email = user.email;
		} catch (error) {}
	});
</script>

<Header company="XJG" platformName="Quote Builder" bind:isSideNavOpen href="/">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		{#if isAuthenticated}
			<HeaderAction
				bind:isOpen={isProfileOpen}
				icon={UserAvatarFilledAlt}
				closeIcon={UserAvatarFilledAlt}
			>
				<HeaderPanelLinks>
					<HeaderPanelDivider>{email}</HeaderPanelDivider>
					<HeaderPanelLink href="/auth/profile/">Profile</HeaderPanelLink>
					<HeaderPanelDivider />
					<HeaderPanelLink on:click={(e) => AuthService.logout(e)}>Log Out</HeaderPanelLink>
				</HeaderPanelLinks>
			</HeaderAction>
		{/if}
		<HeaderAction bind:isOpen={isSwitcherOpen}>
			<HeaderPanelLinks>
				<HeaderPanelLink href="/app">Dashboard</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
