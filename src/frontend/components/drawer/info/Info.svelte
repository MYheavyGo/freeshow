<script lang="ts">
  import { activeShow, activeTimers, forceClock } from "../../../stores"
  import Center from "../../system/Center.svelte"
  import Clock from "../../system/Clock.svelte"
  import Date from "../../system/Date.svelte"
  import TimerInfo from "../timers/TimerInfo.svelte"
  import AudioMix from "./AudioMix.svelte"
  import MediaInfo from "./MediaInfo.svelte"
  import OverlayInfo from "./OverlayInfo.svelte"
  import PlayerInfo from "./PlayerInfo.svelte"
  import ScriptureInfo from "./ScriptureInfo.svelte"
  import ShowInfo from "./ShowInfo.svelte"
  import TemplateInfo from "./TemplateInfo.svelte"

  export let id: string
  export let bible: any
</script>

<!-- TODO: info tabs: clock, quick settings (master volume), local info -->

<div class="main context #drawer_info">
  {#if !$forceClock && id === "shows" && $activeShow !== null && ($activeShow.type === undefined || $activeShow.type === "show")}
    <ShowInfo />
  {:else if !$forceClock && id === "media" && ($activeShow?.type === "video" || $activeShow?.type === "image")}
    <MediaInfo />
  {:else if !$forceClock && id === "audio"}
    <AudioMix />
  {:else if !$forceClock && id === "overlays"}
    <OverlayInfo />
  {:else if !$forceClock && id === "templates"}
    <TemplateInfo />
  {:else if !$forceClock && id === "scripture"}
    <ScriptureInfo {bible} />
  {:else if !$forceClock && id === "timers" && $activeTimers.length}
    <TimerInfo />
  {:else if !$forceClock && id === "player"}
    <PlayerInfo />
  {:else}
    <Center>
      <Clock />
      <Date />
    </Center>
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }
</style>
