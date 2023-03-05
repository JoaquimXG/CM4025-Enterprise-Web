<script>
  import "carbon-components-svelte/css/g100.css";
  import { Content, Grid } from "carbon-components-svelte";
  import UIShell from "$lib/UIShell.svelte";
  
  export const prerender = true;
</script>


<UIShell/>

<Content>
  <Grid fullWidth>
    <slot />
  </Grid>
</Content>

