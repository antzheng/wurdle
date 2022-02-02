import {
  FOUR_LETTER_WORDS,
  FIVE_LETTER_WORDS,
  SIX_LETTER_WORDS,
} from './constants';

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

/**
 * gets today's date in Eastern Time
 * @returns returns array of numbers [month, day, year] in Eastern Time
 */
const getMonthDayYearEST = () => {
  return new Date()
    .toLocaleDateString('en-US', { timeZone: 'America/New_York' })
    .split('/')
    .map((num) => parseInt(num));
};

/**
 * gets today's time in Eastern Time
 * @returns returns array of numbers [hour, minute, second] in Eastern Time
 */
const getHourMinuteSecondEST = () => {
  const [time, timeOfDay] = new Date()
    .toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
    .split(' ');
  let [hour, minute, second] = time.split(':').map((num) => parseInt(num));
  if (timeOfDay === 'PM') hour += 12;
  return [hour, minute, second];
};

/**
 * gets daily puzzle based on desired number of letters
 * @param { number } numLetters
 * @returns daily puzzle
 */
export const getDailyPuzzle = (numLetters) => {
  const [month, day, year] = getMonthDayYearEST();
  const baseIndex = year * 365 + month * 31 + day;
  switch (numLetters) {
    case 4:
      return FOUR_LETTER_WORDS[baseIndex % FOUR_LETTER_WORDS.length];
    case 5:
      return FIVE_LETTER_WORDS[baseIndex % FIVE_LETTER_WORDS.length];
    case 6:
      return SIX_LETTER_WORDS[baseIndex % SIX_LETTER_WORDS.length];
  }
};

/**
 * check if guess is a real word
 * @param { array of objects } guess
 * @returns if guess is a real word
 */
export const isRealWord = (guess) => {
  const numLetters = guess.length;
  const word = guess.map((tile) => tile.letter).join('');
  switch (numLetters) {
    case 4:
      return FOUR_LETTER_WORDS.includes(word);
    case 5:
      return FIVE_LETTER_WORDS.includes(word);
    case 6:
      return SIX_LETTER_WORDS.includes(word);
  }
};