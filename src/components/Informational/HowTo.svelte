<script>
  import CloseIcon from 'svelte-icons/io/IoMdClose.svelte';
  import * as ModalController from './../Generic/Modal.svelte';

  const correctIndex = 0;
  const correctWord = [...'party'];

  const presentIndex = 1;
  const presentWord = [...'react'];

  const absentIndex = 3;
  const absentWord = [...'irate'];

  const correctExample = {
    message: `The letter <b>${correctWord[correctIndex]}</b> is in the word and in the correct spot.`,
    example: correctWord.map((letter, i) => ({
      letter,
      state: i === correctIndex ? 'correct' : 'tbd',
    })),
  };

  const presentExample = {
    message: `The letter <b>${presentWord[presentIndex]}</b> is in the word but in the wrong spot.`,
    example: presentWord.map((letter, i) => ({
      letter,
      state: i === presentIndex ? 'present' : 'tbd',
    })),
  };

  const absentExample = {
    message: `The letter <b>${absentWord[absentIndex]}</b> is not in the word in any spot.`,
    example: absentWord.map((letter, i) => ({
      letter,
      state: i === absentIndex ? 'absent' : 'tbd',
    })),
  };
</script>

<div class="content">
  <header>
    <h1>HOW TO PLAY</h1>
    <button class="button" on:click={() => ModalController.setOpen(false)}>
      <CloseIcon />
    </button>
  </header>
  <p>
    Guess the <b>WURDLE</b>
    in 6 tries.
  </p>

  <p>
    Play in <span class="four-letter">4-letter,</span>
    <span class="five-letter">5-letter,</span>
    and
    <span class="six-letter">6-letter</span>
    modes.
  </p>

  <p>After each guess, the color of the tiles will change.</p>

  <div class="examples">
    <p><b>Examples</b></p>
    {#each [correctExample, presentExample, absentExample] as obj}
      <div class="row">
        {#each obj.example as tile}
          <div class="tile" data-state={tile.state}>
            {tile.letter}
          </div>
        {/each}
      </div>
      <p>{@html obj.message}</p>
    {/each}
  </div>

  <p><b>A new WURDLE will be available each day!</b></p>
</div>

<style lang="scss">
  .content {
    width: 100%;
    height: 100%;
    font-size: 0.85rem;
  }

  span {
    font-weight: bold;
    color: var(--color-correct);
  }

  header {
    width: 100%;
    height: var(--header-height);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid var(--color-tone-4);
    font-size: 0.6rem;
  }

  .examples {
    border-top: 1px solid var(--color-tone-4);
    border-bottom: 1px solid var(--color-tone-4);
  }

  .button {
    color: var(--color-tone-3);
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    transform: translateX(-50%);
  }

  .row {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .tile {
    margin-right: 5px;
    width: 10%;
    min-width: 40px;
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
    aspect-ratio: 1 / 1;
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
