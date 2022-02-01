<script>
  import Header from './components/Header.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import Keyboard from './components/Keyboard.svelte';
</script>

<div id="game">
  <Header />
  <GameBoard />
  <Keyboard />
</div>

<style lang="scss">
  #game {
    width: 100%;
    max-width: var(--app-max-width);
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
