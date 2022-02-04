<script>
  import { onMount } from 'svelte';

  import HelpIcon from 'svelte-icons/io/IoMdHelpCircle.svelte';
  import StatsIcon from 'svelte-icons/io/IoMdStats.svelte';
  import SettingsIcon from 'svelte-icons/io/IoMdSettings.svelte';

  import HowTo from './../Informational/HowTo.svelte';
  import Settings from './../Informational/Settings.svelte';
  import { PAGES } from './../../resources/constants';

  import * as ModalController from './Modal.svelte';

  const handleClick = (page) => {
    ModalController.setOpen(true);
    switch (page) {
      case PAGES.HOWTO:
        ModalController.setContent(HowTo);
        break;
      case PAGES.LEADERBOARD:
        break;
      case PAGES.SETTINGS:
        ModalController.setContent(Settings);
        break;
    }
  };

  onMount(() => {
    handleClick(PAGES.HOWTO);
  });
</script>

<header class="navbar">
  <div class="navbar-content">
    <div class="menu navbar-left">
      <button class="button" on:click={() => handleClick(PAGES.HOWTO)}>
        <HelpIcon />
      </button>
    </div>
    <div class="title">WURDLE</div>
    <div class="menu navbar-right">
      <button class="button" on:click={() => handleClick(PAGES.LEADERBOARD)}>
        <StatsIcon />
      </button>
      <button class="button" on:click={() => handleClick(PAGES.SETTINGS)}>
        <SettingsIcon />
      </button>
    </div>
  </div>
</header>

<style lang="scss">
  .navbar {
    width: 100%;
    height: var(--header-height);
    color: var(--color-tone-1);
    border-bottom: 1px solid var(--color-tone-4);
    display: flex;
    align-items: center;
  }

  .navbar-content {
    width: 100%;
    max-width: var(--game-max-width);
    margin: 0 auto;
    padding: 0px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-left {
    justify-content: flex-start;
  }

  .navbar-right {
    justify-content: flex-end;
  }

  .menu {
    display: flex;
    align-items: center;
    min-width: 75px;
    margin-top: 2px;
  }

  .title {
    font-weight: 700;
    font-size: 36px;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
    pointer-events: none;
  }

  .button {
    color: var(--color-tone-3);
    width: 30px;
    height: 30px;
    padding: 3px;
    margin: 0 3px;
  }

  @media (max-width: 360px) {
    .title {
      font-size: 22px;
      letter-spacing: 0.1rem;
    }
  }
</style>
