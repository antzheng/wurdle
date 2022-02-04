<script>
  import Header from './components/Generic/Header.svelte';
  import GameBoard from './components/Gameplay/GameBoard.svelte';
  import Keyboard from './components/Gameplay/Keyboard.svelte';
  import Toast, { ToastController } from './components/Generic/Toast.svelte';
  import Modal from './components/Generic/Modal.svelte';
  import * as utils from './resources/utils.js';

  // state
  // settings
  let isDarkMode = false;
  let isHighContrast = false;
  let numLetters = 5;

  // game play
  let board = [];
  let currentGuess = '';
  let solution = utils.getDailyPuzzle(numLetters);

  // setters
  const setDarkMode = (state) => (isDarkMode = state);
  const setHighContrast = (state) => (isHighContrast = state);
  const setNumLetters = (state) => (numLetters = state);

  // derived values
  $: darkMode = [isDarkMode, setDarkMode];
  $: contrastMode = [isHighContrast, setHighContrast];
  $: gameMode = [numLetters, setNumLetters];

  // side effects
  $: document.body.classList.toggle('darkmode', isDarkMode);
  $: document.body.classList.toggle('highcontrast', isHighContrast);
  $: {
    board = [];
    currentGuess = '';
    solution = utils.getDailyPuzzle(numLetters);
  }

  // handlers
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

    // check if game is over
    if (utils.isWin(board, solution)) {
      ToastController.push('Genius', { duration: 2000 });
      // TODO: BRING UP THE LEADERBOARD MODAL
    } else if (utils.isLoss(board)) {
      ToastController.push(solution.toUpperCase(), { duration: 2000 });
    }
  };
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
