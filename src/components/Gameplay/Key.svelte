<script>
  import BackspaceIcon from 'svelte-icons/io/IoMdBackspace.svelte';

  // props
  export let char, addLetter, removeLetter, submitGuess, keyboardState;

  // derived values
  $: isSpecialChar = '↵←'.includes(char);
  $: renderedChar = char === '↵' ? 'enter' : char;
  $: state = keyboardState[char];

  // handlers
  const handleClick = (char) => {
    switch (char) {
      case '↵':
        submitGuess();
        break;
      case '←':
        removeLetter();
        break;
      default:
        addLetter(char);
        break;
    }
  };
</script>

<button
  class="key"
  class:special={isSpecialChar}
  on:click={() => handleClick(char)}
  data-state={state}
>
  {#if renderedChar === '←'}
    <div class="backspace">
      <BackspaceIcon />
    </div>
  {:else}
    {renderedChar}
  {/if}
</button>

<style lang="scss">
  .key {
    font-size: 0.85rem;
  }

  .special {
    flex: 1.5;
    font-size: 12px;
  }

  .backspace {
    width: 30px;
    height: 30px;
  }

  button[data-state='correct'] {
    background-color: var(--key-bg-correct);
    color: var(--key-evaluated-text-color);
  }

  button[data-state='present'] {
    background-color: var(--key-bg-present);
    color: var(--key-evaluated-text-color);
  }

  button[data-state='absent'] {
    background-color: var(--key-bg-absent);
    color: var(--key-evaluated-text-color);
  }
</style>
