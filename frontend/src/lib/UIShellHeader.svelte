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

	export let isSideNavOpen = false;

	let isProfileOpen = false;
	let isSwitcherOpen = false;
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
		<HeaderAction
			bind:isOpen={isProfileOpen}
			icon={UserAvatarFilledAlt}
			closeIcon={UserAvatarFilledAlt}
		>
			<HeaderPanelLinks>
				<HeaderPanelDivider>{'<Username>'}</HeaderPanelDivider>
				<HeaderPanelLink>Profile</HeaderPanelLink>
				<HeaderPanelDivider />
				<HeaderPanelLink>Log Out</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
		<HeaderAction bind:isOpen={isSwitcherOpen}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
