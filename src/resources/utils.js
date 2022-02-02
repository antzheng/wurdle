/**
 * return whether the guess is the answer
 * @param { array of objects } guess
 * @param { string } solution
 * @returns whether the guess is the answer
 */
export const isGuessCorrect = (guess, solution) => {
  return guess.map((tile) => tile.letter).join('') === solution;
};

/**
 * marks the board and the keyboard based on a guess
 * @param { array of objects } guess
 * @param { string } solution
 * @param { object of letters -> states } guessedLetters
 */
export const validateGuess = (guess, solution, guessedLetters) => {
  // fill in frequency map
  const freq = {};
  for (const letter of solution) {
    if (!freq.hasOwnProperty(letter)) freq[letter] = 0;
    freq[letter] += 1;
  }

  // place correct guesses
  guess.forEach((tile, i) => {
    if (tile.letter === solution[i]) {
      tile.state = 'correct';
      freq[tile.letter] -= 1;

      // mark the keyboard
      guessedLetters[tile.letter] = 'correct';
    } else {
      tile.state = 'absent';

      // mark the keyboard as absent if not correct or present
      const state = guessedLetters[tile.letter];
      if (state !== 'correct' && state !== 'present') {
        guessedLetters[tile.letter] = 'absent';
      }
    }
  });

  // find misplaced letters
  guess.forEach((tile) => {
    if (tile.state === 'absent' && freq[tile.letter] > 0) {
      tile.state = 'present';
      freq[tile.letter] -= 1;

      // mark the keyboard as present if not correct
      const state = guessedLetters[tile.letter];
      if (state !== 'correct') {
        guessedLetters[tile.letter] = 'present';
      }
    }
  });
};
