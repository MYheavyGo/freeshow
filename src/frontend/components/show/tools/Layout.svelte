<script lang="ts">
  import { activePopup, activeShow, dictionary, fullColors, groupNumbers, groups, selected, showsCache } from "../../../stores"
  import { GetLayout, GetLayoutRef } from "../../helpers/get"
  import { history } from "../../helpers/history"
  import Icon from "../../helpers/Icon.svelte"
  import T from "../../helpers/T.svelte"
  import { joinTime, secondsToTime } from "../../helpers/time"
  import Button from "../../inputs/Button.svelte"
  import NumberInput from "../../inputs/NumberInput.svelte"
  import Center from "../../system/Center.svelte"
  import DropArea from "../../system/DropArea.svelte"
  import SelectElem from "../../system/SelectElem.svelte"

  $: show = JSON.parse(JSON.stringify($showsCache[$activeShow!.id]))
  $: activeLayout = $showsCache[$activeShow!.id].settings.activeLayout
  $: slides = [GetLayout($activeShow!.id, activeLayout), show.layouts[activeLayout].slides][0]

  $: {
    if (show) {
      let added: any = {}
      Object.values(show.slides).map((slide: any) => {
        if (slide.globalGroup && $groups[slide.globalGroup]) {
          if ($groups[slide.globalGroup].default) slide.group = $dictionary.groups[$groups[slide.globalGroup].name]
          else slide.group = $groups[slide.globalGroup].name
          slide.color = $groups[slide.globalGroup].color
        }

        // different slides with same name
        if (slide.group) {
          if (added[slide.group]) {
            added[slide.group]++
            slide.group += " " + added[slide.group]
          } else added[slide.group] = 1
        }
        return slide
      })

      // same group count
      if ($groupNumbers) {
        added = {}
        let ref: any = GetLayoutRef()
        slides.forEach((a: any, i: number) => {
          if (ref[i].type === "parent") {
            if (added[a.id]) {
              added[a.id]++
              a.count = "(" + added[a.id] + ")"
            } else added[a.id] = 1
          }
        })
      }
    }
  }

  function change(e: any, i: number) {
    let value = Number(e.detail)
    if (typeof value === "number") {
      history({
        id: "changeLayout",
        newData: { key: "nextTimer", value },
        location: { page: "show", show: $activeShow!, layout: activeLayout, layoutSlide: i },
      })
    }
  }

  function toggleEnd(i: number, value: null | boolean = null) {
    // TODO: more global way of doing this!
    showsCache.update((a: any) => {
      // let ref: any[] = GetLayoutRef()
      let slides = a[$activeShow!.id].layouts[activeLayout].slides
      // remove old
      let currentIndex: number = -1
      slides.forEach((l: any) => {
        currentIndex++
        if (currentIndex === i && l.end !== true) l.end = value === null ? true : value
        else if ((!value || currentIndex !== i) && l.end) delete l.end
        let children: string[] = a[$activeShow!.id].slides[l.id]?.children
        if (children?.length) {
          if (!l.children) l.children = {}
          children.forEach((child) => {
            currentIndex++
            if (currentIndex === i && l.children[child]?.end !== true) {
              if (!l.children[child]) l.children[child] = {}
              l.children[child].end = value === null ? true : value
            } else if ((!value || currentIndex !== i) && l.children[child]?.end) delete l.children[child]?.end
          })
        }
      })
      return a
    })
  }

  // total time
  let total: number = 0
  $: {
    if (slides.length) {
      let temp = 0
      slides.forEach((slide: any) => {
        if ((slide.nextTimer || 0) > 0) temp += slide.nextTimer
      })
      total = temp
    } else total = 0
  }
  $: totalTime = total ? (total > 59 ? joinTime(secondsToTime(total)) : total + "s") : "0s"

  // apply to all
  let allTime: number = 10
  function changeAll(reset: boolean = false) {
    let location: any = { page: "show", show: $activeShow!, layout: activeLayout }
    history({ id: "changeLayouts", newData: { key: "nextTimer", value: reset ? 0 : allTime }, location })
    if (reset) history({ id: "changeLayouts", newData: { key: "transition", value: undefined }, location })
    let index = 0
    slides.forEach((slide: any, i: number) => {
      if (reset && slide.end) index = i
      else if (!reset && !slide.disabled) index = i
    })
    toggleEnd(index, !reset)
  }
</script>

{#if slides.length}
  <div class="content">
    <div>
      <DropArea id="slides" hoverTimeout={0} selectChildren>
        {#each slides as slide, i}
          <div class="slide" class:disabled={slide.disabled}>
            <span style="margin: 10px 5px;min-width: 20px;text-align: center;opacity: 0.8;">{i + 1}</span>
            <SelectElem id="slide" data={{ index: i }} draggable trigger="column" style="height: 100%;flex: 3;max-width: 50%;">
              <p class="group context #slide" style="border-bottom: {slide.color ? '2px solid ' + slide.color : 'unset'};{$fullColors ? '' : `color: ${slide.color};`}">
                {show.slides[slide.id].group === null ? "" : show.slides[slide.id].group || "—"}{slide.count ? " " + slide.count : ""}
              </p>
            </SelectElem>
            <!-- transition -->
            <Button
              style="height: 100%;"
              title={$dictionary.popup?.transition}
              on:click={() => {
                selected.set({ id: "slide", data: [{ ...slide, index: i }] })
                activePopup.set("transition")
              }}
            >
              <Icon id="transition" white={!slide?.transition && !slide?.mediaTransition} />
            </Button>
            <!-- next timer -->
            <!-- empty or 0 === disabled -->
            <NumberInput title={$dictionary.preview.nextTimer} value={slide.nextTimer || 0} on:change={(e) => change(e, i)} buttons={false} />
            <!-- <TextInput type="number" style="min-width: 50px;flex: 1;" value={0} on:change={(e) => change(e, i)} center /> -->
            <!-- to beginning -->
            <Button title={$dictionary.preview.to_start} style="height: 100%;" on:click={() => toggleEnd(i)}>
              <Icon id="restart" white={slide.end !== true} />
            </Button>
          </div>
        {/each}
      </DropArea>
    </div>
  </div>
  <!-- padding: 5px;gap: 5px; -->
  <div class="bottom" style="display: flex;flex-direction: column;">
    <div style="display: flex;gap: 5px;">
      <!-- <Button style="height: 100%;">
      <Icon id="transition" />
    </Button> -->
      <NumberInput value={allTime} on:change={(e) => (allTime = Number(e.detail))} />
      <!-- Apply to all / selected -->
      <Button style="flex: 1;" on:click={() => changeAll()} dark center>
        <Icon id="clock" right />
        <T id="actions.to_all" />
      </Button>
    </div>
    <div style="display: flex;gap: 5px;">
      <span style="flex: 1;display: flex;align-items: center;justify-content: center;">{totalTime}</span>
      <Button style="flex: 1;" on:click={() => changeAll(true)} center dark>
        <Icon id="reset" right />
        <T id="actions.reset" />
      </Button>
    </div>
  </div>
{:else}
  <Center faded>
    <T id="empty.slides" />
  </Center>
{/if}

<style>
  .content {
    overflow-y: auto;
    height: 100%;
  }

  .slide {
    height: 28px;
    display: flex;
    align-items: center;
    margin: 5px 0;
  }

  .slide.disabled {
    opacity: 0.2;
  }

  .slide :global(.numberInput),
  .bottom :global(.numberInput) {
    flex: 1;
  }

  .group {
    /* width: 100%; */
    /* overflow-x: hidden;
    text-overflow: ellipsis; */
    /* justify-content: flex-start; */

    flex: 3;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    font-size: 0.8em;
    font-weight: bold;
    /* background-color: inherit; */
    background-color: var(--primary-darker);
  }
</style>
