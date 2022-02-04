<script>
  import { onMount } from 'svelte';
  import * as utils from './../../resources/utils.js';

  // props
  export let numLetters, board, currentGuess, solution;

  // refs
  let containerElement, boardElement;

  // derived values and side effects
  $: renderedBoard = utils.getRenderedBoard(board, currentGuess, solution);
  $: numLetters, handleResize();

  // handlers
  const handleResize = () => {
    if (!containerElement || !boardElement) return;

    // figure out aspect ratio
    const aspectRatio = numLetters / 6;

    // specify max height
    const maxHeight = 420;

    // now try to make board aspect ratio with 100% height
    const containerHeight = parseInt(
      window.getComputedStyle(containerElement).height
    );
    const containerWidth = parseInt(
      window.getComputedStyle(containerElement).width
    );
    let height = Math.min(containerHeight, maxHeight);
    let width = aspectRatio * height;

    // fix if width exceeds maxWidth
    const maxWidth = 0.9 * containerWidth;
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    // round to whole pixels
    width = Math.round(width);
    height = Math.round(height);

    // set up the properties
    boardElement.style.width = `${width}px`;
    boardElement.style.height = `${height}px`;
  };

  // lifecycle
  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<div class="container" bind:this={containerElement}>
  <div
    class="game-board"
    style="--columns:{numLetters}"
    bind:this={boardElement}
  >
    {#each renderedBoard as row}
      <div class="row">
        {#each row as tile}
          <div class="tile" data-state={tile.state}>
            {tile.letter}
          </div>
        {/each}

        {#each [...Array(numLetters - row.length)] as _}
          <div class="tile" data-state="empty" />
        {/each}
      </div>
    {/each}

    {#each [...Array(Math.max(0, 5 - board.length))] as _}
      <div class="row">
        {#each [...Array(numLetters)] as _}
          <div class="tile" data-state="empty" />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: var(--game-max-width);
    flex-grow: 1;
    padding: 0 8px;
    overflow: hidden;
  }

  .game-board {
    position: absolute;
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    grid-gap: 5px;
    padding: 10px;
    box-sizing: border-box;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    grid-gap: 5px;
  }

  .tile {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    color: var(--tile-text-color);
    text-transform: uppercase;
    user-select: none;
  }

  .tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  .tile[data-state='empty'] {
    border: 2px solid var(--color-tone-4);
  }

  .tile[data-state='tbd'] {
    background-color: var(--color-tone-7);
    border: 2px solid var(--color-tone-3);
    color: var(--color-tone-1);
  }

  .tile[data-state='absent'] {
    background-color: var(--color-absent);
  }

  .tile[data-state='present'] {
    background-color: var(--color-present);
  }

  .tile[data-state='correct'] {
    background-color: var(--color-correct);
  }

  @media (max-height: 600px) {
    .tile {
      font-size: 1em;
      line-height: 1em;
    }
  }

  @media (max-width: 360px) {
    .tile {
      font-size: 1em;
      line-height: 1em;
    }
  }
</style>
