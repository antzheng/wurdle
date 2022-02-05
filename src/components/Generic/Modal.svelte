<script context="module">
  const { isOpen, content } = ModalStore;

  export const setOpen = (state) => {
    isOpen.set(state);
  };

  export const setContent = (state) => {
    content.set(state);
  };
</script>

<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { ModalStore } from './../../resources/stores';
  import * as utils from './../../resources/utils.js';

  // props
  export let darkMode, contrastMode, gameMode;

  // state
  let currentTime = utils.getCurrentSecondsInTodayEST();

  // store
  const { isOpen, content } = ModalStore;

  // handlers
  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;
    if (!$isOpen) return;
    isOpen.set(false);
  };

  const handleClick = () => {
    isOpen.set(false);
  };

  // lifecycle
  onMount(() => {
    const tick = () => (currentTime += 1);
    setInterval(tick, 1000);
    return () => clearInterval(tick);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $isOpen}
  <div class="modal-outside" on:click|stopPropagation={handleClick}>
    <div
      class="modal-container"
      on:click|stopPropagation
      transition:fly={{ y: 500, duration: 200 }}
    >
      <svelte:component
        this={$content}
        {darkMode}
        {contrastMode}
        {gameMode}
        {currentTime}
      />
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-outside {
    background-color: var(--opacity-50);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-container {
    position: relative;
    border-radius: 8px;
    border: 1px solid var(--color-tone-6);
    background-color: var(--modal-content-bg);
    color: var(--color-tone-1);
    box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
    width: 90%;
    max-height: 90%;
    overflow-y: auto;
    max-width: calc(var(--game-max-width) / 2);
    padding: 5px 16px;
    box-sizing: border-box;
  }
</style>
