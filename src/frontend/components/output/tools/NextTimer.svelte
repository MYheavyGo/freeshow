<script lang="ts">
  import { dictionary } from "../../../stores"
  import Icon from "../../helpers/Icon.svelte"
  import Button from "../../inputs/Button.svelte"
  import Slider from "../../inputs/Slider.svelte"

  export let currentOutput: any
  export let timer: any

  // $: if (!currentOutput?.out?.transition) {
  //   let outs = getActiveOutputs().map((id) => $outputs[id])
  //   currentOutput = outs.find((output) => output.out?.transition)
  // }

  let autoPause: boolean = false
  function transitionChange(e: any) {
    if (!timer.paused) {
      autoPause = true
      timer.timer.pause()
    }
    timer.time = Number(e.target.value)
  }
  function mouseup() {
    if (autoPause) {
      timer.timer.resume()
      autoPause = false
    }
  }

  function round(value: number, step = 1) {
    var inv = 1 / step
    return Math.floor(value * inv) / inv
  }
</script>

<svelte:window on:mouseup={mouseup} />

{#if currentOutput?.out?.transition}
  <!-- <span class="name">
    <p><T id="transition.{currentOutput?.out?.transition.type || 'fade'}" /></p>
  </span> -->
  {#if timer.timer}
    <span class="group">
      <Button
        style="flex: 0"
        center
        title={timer.paused ? $dictionary.media?.play : $dictionary.media?.pause}
        on:click={() => {
          if (timer.paused) timer.timer.resume()
          else timer.timer.pause()
        }}
      >
        <Icon id={timer.paused ? "play" : "pause"} size={1.2} />
      </Button>
      <span style="color: var(--secondary);padding: 0 10px;">{round(timer.time)}</span>
      <Slider style="flex: 1;" bind:value={timer.time} step={0.5} max={timer.max} on:input={transitionChange} />
      <!-- <input type="range" bind:value={timer.time} step={0.5} max={timer.max} name="" id="" on:input={transitionChange} /> -->
      <span style="padding: 0 10px;">{round(currentOutput?.out?.transition.duration)}</span>
    </span>
  {/if}
{/if}

<style>
  .group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .group :global(button) {
    flex-grow: 1;
    /* height: 40px; */
  }

  /* .name {
    display: flex;
    justify-content: center;
    padding: 10px;
    opacity: 0.8;
  } */
</style>
