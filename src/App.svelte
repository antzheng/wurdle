<script>
  import { onMount } from 'svelte';
  import Header from './components/Generic/Header.svelte';
  import GameBoard from './components/Gameplay/GameBoard.svelte';
  import Keyboard from './components/Gameplay/Keyboard.svelte';
  import Toast, { ToastController } from './components/Generic/Toast.svelte';
  import Modal from './components/Generic/Modal.svelte';
  import * as utils from './resources/utils.js';
  import * as ModalController from './resources/modalController';
  import { PAGES } from './resources/constants.js';

  // state
  // settings
  let isDarkMode = false;
  let isHighContrast = false;
  let numLetters = 5;

  // game play
  let board = [];
  let currentGuess = '';
  let solution = utils.getDailyPuzzle(numLetters);

  // derived values
  $: darkMode = [isDarkMode, setDarkMode];
  $: contrastMode = [isHighContrast, setHighContrast];
  $: gameMode = [numLetters, setNumLetters];

  // side effects
  $: document.body.classList.toggle('darkmode', isDarkMode);
  $: document.body.classList.toggle('highcontrast', isHighContrast);
  $: {
    currentGuess = '';
    board = utils.getBoardFromStorage(numLetters);
    solution = utils.getDailyPuzzle(numLetters);
  }

  // handlers
  const setDarkMode = (state) => {
    isDarkMode = state;
    utils.setSettingsInStorage(numLetters, isDarkMode, isHighContrast);
  };

  const setHighContrast = (state) => {
    isHighContrast = state;
    utils.setSettingsInStorage(numLetters, isDarkMode, isHighContrast);
  };

  const setNumLetters = (state) => {
    numLetters = state;
    utils.setSettingsInStorage(numLetters, isDarkMode, isHighContrast);
  };

  const addLetter = (letter) => {
    if (utils.isGameOver(board, solution)) return;
    if (currentGuess.length >= numLetters) return;
    currentGuess += letter;
  };

  const removeLetter = () => {
    if (utils.isGameOver(board, solution)) return;
    if (currentGuess.length === 0) return;
    currentGuess = currentGuess.slice(0, -1);
  };

  const submitGuess = () => {
    if (utils.isGameOver(board, solution)) return;

    // too few letters
    if (currentGuess.length < numLetters) {
      ToastController.push('Not enough letters!');
      return;
    }

    // isn't in word list
    if (!utils.isRealWord(currentGuess)) {
      ToastController.push('Not in word list!');
      return;
    }

    // valid word, add to board
    board = [...board, currentGuess];
    currentGuess = '';

    // store new board in local storage
    utils.setBoardInStorage(numLetters, board);

    // check if game is over
    if (utils.isGameOver(board, solution)) {
      const delay = 1500;

      // check if player won
      const isWin = utils.isWin(board, solution);

      // send win or loss message
      const message = isWin ? 'Genius' : solution.toUpperCase();
      ToastController.push(message, { duration: delay });

      // update stats in storage
      const numGuesses = isWin ? board.length : 0;
      utils.setStatsInStorage(numLetters, numGuesses);

      // bring up leaderboard modal
      setTimeout(
        () => ModalController.openModalToPage(PAGES.LEADERBOARD),
        delay
      );
    }
  };

  // lifecycle
  onMount(() => {
    // set up the settings state from local storage
    const settings = utils.getSettingsFromStorage();
    numLetters = settings.gameMode;
    isDarkMode = settings.isDarkMode;
    isHighContrast = settings.isHighContrast;
    solution = utils.getDailyPuzzle(numLetters);

    // set up board state from local storage
    board = utils.getBoardFromStorage(numLetters);

    // bring up respective modal based on completion
    if (utils.isGameOver(board, solution)) {
      ModalController.openModalToPage(PAGES.LEADERBOARD);
    } else {
      ModalController.openModalToPage(PAGES.HOWTO);
    }
  });
</script>

<div id="game">
  <Header />
  <GameBoard {numLetters} {board} {currentGuess} {solution} />
  <Keyboard {addLetter} {removeLetter} {submitGuess} {board} {solution} />
</div>
<Toast />
<Modal {darkMode} {contrastMode} {gameMode} />

<style lang="scss">
  #game {
    width: 100%;
    max-width: var(--app-max-width);
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow: hidden;
  }
</style>
