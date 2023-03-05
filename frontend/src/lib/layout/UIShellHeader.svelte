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
	import UserService from '$lib/services/UserService';

	export let isSideNavOpen = false;
	export let isAuthenticated = false;

	let isProfileOpen = false;
	let isSwitcherOpen = false;
	let email = '<email>';

	onMount(async () => {
		try {
			let user = await UserService.me();
			if (user) email = user.email;
		} catch (error) {}
	});
</script>

<Header company="XJG" platformName="Quote Builder" bind:isSideNavOpen href="/">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<!-- <HeaderNav>
    <HeaderNavItem href="/" text="Link 1" />
    <HeaderNavItem href="/" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
    <HeaderNavItem href="/" text="Link 4" />
  </HeaderNav> -->

	<HeaderUtilities>
		{#if isAuthenticated}
			<HeaderAction
				bind:isOpen={isProfileOpen}
				icon={UserAvatarFilledAlt}
				closeIcon={UserAvatarFilledAlt}
			>
				<HeaderPanelLinks>
					<HeaderPanelDivider>{email}</HeaderPanelDivider>
					<HeaderPanelLink>Profile</HeaderPanelLink>
					<HeaderPanelDivider />
					<HeaderPanelLink on:click={(e) => AuthService.logout(e)}>Log Out</HeaderPanelLink>
				</HeaderPanelLinks>
			</HeaderAction>
		{/if}
		<HeaderAction bind:isOpen={isSwitcherOpen}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
