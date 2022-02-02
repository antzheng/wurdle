<script>
  import Key from './Key.svelte';

  const rows = ['qwertyuiop', 'asdfghjkl', '↵zxcvbnm←'];

  export let addLetter, removeLetter, submitGuess, guessedLetters;

  const handleKeydown = (event) => {
    const key = event.key;
    const isLetter = key.length === 1 && key.match(/[a-z]/i);
    if (!isLetter && key !== 'Enter' && key !== 'Backspace') return;
    switch (key) {
      case 'Enter':
        submitGuess();
        break;
      case 'Backspace':
        removeLetter();
        break;
      default:
        addLetter(key);
        break;
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="container">
  <div class="keyboard">
    {#each rows as row, i}
      <div class="row">
        {#if i === 1}
          <div class="spacer" />
        {/if}

        {#each row as char}
          <Key
            {char}
            {addLetter}
            {removeLetter}
            {submitGuess}
            {guessedLetters}
          />
        {/each}

        {#if i === 1}
          <div class="spacer" />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--keyboard-height);
    width: 100%;
  }

  .keyboard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: var(--game-max-width);
    user-select: none;
    padding: 0 8px;
  }

  .row {
    display: flex;
    width: 100%;
    margin: 0 auto 8px;
    touch-action: manipulation;
  }

  :global(.key) {
    font-family: inherit;
    font-weight: bold;
    border: 0;
    padding: 0;
    margin: 0 6px 0 0;
    height: 58px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    background-color: var(--key-bg);
    color: var(--key-text-color);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
  }

  :global(.key):last-of-type {
    margin: 0;
  }

  .spacer {
    flex: 0.5;
  }
</style>
