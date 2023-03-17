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

	import { onMount, getContext } from 'svelte';
	import AuthService from '$lib/services/AuthService.js';
	import UserContext from '$lib/contexts/UserContext';

	export let isSideNavOpen = false;

	let isProfileOpen = false;
	let isSwitcherOpen = false;
	let label = '';
	let isAuthenticated = false;

	let { User, isAuthenticated: _isAuthenticated, ready } = getContext(UserContext);

	onMount(async () => {
		await ready;
		isAuthenticated = _isAuthenticated();
		if ($User) label = `${$User.firstName} ${$User.lastName}`;
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
					<HeaderPanelDivider>{label}</HeaderPanelDivider>
					<HeaderPanelLink href="/auth/profile">Profile</HeaderPanelLink>
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
