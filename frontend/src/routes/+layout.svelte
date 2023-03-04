<script>
  import "carbon-components-svelte/css/white.css";
  import { Content, Grid } from "carbon-components-svelte";
  // import TutorialHeader from "$lib/TutorialHeader.svelte";
  import UIShell from "$lib/UIShell.svelte";
</script>

<!-- <TutorialHeader /> -->

<UIShell/>

<Content style="padding: 0">
  <Grid fullWidth>
    <slot />
  </Grid>
</Content>

