<script>
  export let numLetters, board;
</script>

<div class="container">
  <div class="game-board" style="--columns:{numLetters}">
    {#each board as row}
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

    max-width: calc(var(--columns) * 70px);
    max-height: 420px;

    height: 100%;
    aspect-ratio: var(--columns) / 6;
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
</style>
