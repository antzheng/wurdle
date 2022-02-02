<script>
  import Header from './components/Header.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import Keyboard from './components/Keyboard.svelte';
  import { NUM_ROWS } from './resources/constants.js';
  import {
    validateGuess,
    isGuessCorrect,
    isRealWord,
    getDailyPuzzle,
  } from './resources/utils.js';

  // state
  let isDarkMode = false;
  let isHighContrast = false;
  let isGameOver = false;
  let numLetters = 5;
  let board = [...Array(NUM_ROWS)].map(() => []);
  let currentGuess = 0;
  let guessedLetters = {};
  let solution = getDailyPuzzle(numLetters);

  // side effects
  $: document.body.classList.toggle('darkmode', isDarkMode);
  $: document.body.classList.toggle('highcontrast', isHighContrast);
  $: numLetters, (board = [...Array(NUM_ROWS)].map(() => []));
  $: isGameOver = isGameOver || currentGuess >= NUM_ROWS;
  $: solution = getDailyPuzzle(numLetters);

  // handlers
  const addLetter = (letter) => {
    if (isGameOver) return;
    if (board[currentGuess].length >= numLetters) return;
    board[currentGuess].push({ letter, state: 'tbd' });
    board = board;
  };

  const removeLetter = () => {
    if (isGameOver) return;
    if (board[currentGuess].length === 0) return;
    board[currentGuess].pop();
    board = board;
  };

  const submitGuess = () => {
    if (isGameOver) return;
    const guess = board[currentGuess];
    if (guess.length < numLetters) return;
    if (!isRealWord(guess)) return;
    validateGuess(guess, solution, guessedLetters);
    currentGuess += 1;
    board = board;
    guessedLetters = guessedLetters;
    if (isGuessCorrect(guess, solution)) isGameOver = true;
  };
</script>

<div id="game">
  <Header />
  <GameBoard {numLetters} {board} />
  <Keyboard {addLetter} {removeLetter} {submitGuess} {guessedLetters} />
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
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
</style>
