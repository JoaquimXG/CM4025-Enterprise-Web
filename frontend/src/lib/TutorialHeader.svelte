<script>
  import {
    SkipToContent,
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderUtilities,
    HeaderGlobalAction,
  } from "carbon-components-svelte";
  import {
    Notification,
    UserAvatar,
    Switcher,
  } from "carbon-icons-svelte";
  // import { page } from "$app/stores";
</script>

<Header company="IBM" platformName="Carbon Tutorial" href="/">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderNav>
    <HeaderNavItem
      text="Repositories"
      href="/repos"
    />
  </HeaderNav>
  <HeaderUtilities>
    <HeaderGlobalAction aria-label="Notifications" icon={Notification} />
    <HeaderGlobalAction aria-label="User Avatar" icon={UserAvatar} />
    <HeaderGlobalAction aria-label="App Switcher" icon={Switcher} />
  </HeaderUtilities>
</Header>
