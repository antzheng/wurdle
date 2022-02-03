<script>
  import CloseIcon from 'svelte-icons/io/IoMdClose.svelte';
  import * as ModalController from './../Generic/Modal.svelte';

  export let darkMode, contrastMode, gameMode;

  $: [isDarkMode, setDarkMode] = darkMode;
  $: [isHighContrast, setHighContrast] = contrastMode;
  $: [numLetters, setNumLetters] = gameMode;
</script>

<div class="content">
  <header>
    <h1>SETTINGS</h1>
    <button class="button" on:click={() => ModalController.setOpen(false)}>
      <CloseIcon />
    </button>
  </header>

  <div class="radio-group">
    {#each [4, 5, 6] as value}
      <input
        id={`radio-${value}`}
        name={`radio-${value}`}
        type="radio"
        {value}
        checked={value === numLetters}
        on:change={() => setNumLetters(value)}
      />
      <label for={`radio-${value}`}>{value}</label>
    {/each}
  </div>
</div>

<style lang="scss">
  .content {
    width: 100%;
    height: 100%;
    font-size: 0.85rem;
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

  .button {
    color: var(--color-tone-3);
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    transform: translateX(-50%);
  }

  .radio-group {
    display: flex;
    overflow: hidden;
    width: 500px;
  }

  .radio-group::before {
    content: '';
    display: inline-block;
    width: 10px;
    border-radius: 50px 0 0 50px;
    border: 1px solid var(--color-tone-4);
    border-right: none;
  }

  .radio-group::after {
    content: '';
    display: inline-block;
    width: 10px;
    border-radius: 0 50px 50px 0;
    border: 1px solid var(--color-tone-4);
    border-left: none;
  }

  .radio-group input {
    position: absolute !important;
    clip: rect(0, 0, 0, 0);
    border: 0;
    overflow: hidden;
  }

  .radio-group input:checked + label {
    background-color: var(--color-correct);
    box-shadow: none;
    position: relative;
  }

  .radio-group input:checked + label::before {
    content: '';
    position: absolute;
    width: 10px;
    top: 0;
    bottom: 0;
    left: 0;
    margin-left: -10px;
    border-radius: 50px 0 0 50px;
    background-color: var(--color-correct);
  }

  .radio-group input:checked + label::after {
    content: '';
    position: absolute;
    width: 10px;
    top: 0;
    bottom: 0;
    right: 0;
    margin-right: -10px;
    border-radius: 0 50px 50px 0;
    background-color: var(--color-correct);
  }

  .radio-group label {
    border-top: 1px solid var(--color-tone-4);
    border-bottom: 1px solid var(--color-tone-4);
    color: var(--key-text-color);
    text-align: center;
    padding: 5px 16px;
    margin-right: -1px;
  }

  .radio-group label:hover {
    cursor: pointer;
  }
</style>
