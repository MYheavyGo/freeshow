<script>
  import { setExampleOverlays } from "../../../utils/createData"
  import Button from "../../inputs/Button.svelte"
</script>

<main>
  <Button style="width: 100%;" on:click={setExampleOverlays} center dark>Refresh example overlays</Button>
</main>

<style>
  main {
    padding: 10px;
  }
</style>
