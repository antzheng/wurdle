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

  <div class="row">
    <div class="text">Game Mode</div>
    <div class="radio-group">
      <div class="radio-slider" style="--offset:{numLetters - 4}" />
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

  <div class="row">
    <div class="text">Dark Mode</div>
    <div class="toggle-container">
      <label class="switch">
        <input
          type="checkbox"
          checked={isDarkMode}
          on:change={() => setDarkMode(!isDarkMode)}
        />
        <span class="slider" />
      </label>
    </div>
  </div>

  <div class="row">
    <div class="text">High Contrast</div>
    <div class="toggle-container">
      <label class="switch">
        <input
          type="checkbox"
          checked={isHighContrast}
          on:change={() => setHighContrast(!isHighContrast)}
        />
        <span class="slider" />
      </label>
    </div>
  </div>

  <p>
    <b>WURDLE:</b>
    inspired by Josh Wardle's
    <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">
      WORDLE!
    </a>
  </p>
</div>

<style lang="scss">
  * {
    -webkit-tap-highlight-color: transparent;
  }

  p {
    margin: 50px 0 10px 0;
    font-size: 14px;
  }

  a {
    font-weight: bold;
    color: var(--color-correct);
    transition: 0.2s;
  }

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

  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-tone-4);
    height: 60px;
    font-size: 18px;
  }

  .radio-group {
    height: 50%;
    width: 175px;
  }

  .toggle-container {
    height: 50%;
    width: calc(175px / 3);
  }

  .radio-slider {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: calc(100% / 3);
    transform: translateX(calc(100% * var(--offset)));
    background-color: var(--color-correct);
    border-radius: 9999px;
    transition: 0.2s;
  }

  .radio-group {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--color-tone-4);
    border-radius: 9999px;
    overflow: hidden;
  }

  .radio-group input[type='radio'] {
    appearance: none;
    display: none;
  }

  .radio-group label {
    z-index: 1;
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
    color: var(--key-text-color);
    transition: 0.2s;
    font-weight: bold;
  }

  .radio-group input[type='radio']:checked + label {
    color: var(--tile-text-color);
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-tone-4);
    transition: 0.2s;
    border-radius: 34px;
  }

  .slider::before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--color-correct);
  }

  input:checked + .slider::before {
    transform: translate(27px, -50%);
  }
</style>
