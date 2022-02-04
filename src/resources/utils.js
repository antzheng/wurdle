import { FOUR_LETTER_WORD_BANK, VALID_FOUR_LETTER_WORDS } from './4-letters';
import { FIVE_LETTER_WORD_BANK, VALID_FIVE_LETTER_WORDS } from './5-letters';
import { SIX_LETTER_WORD_BANK, VALID_SIX_LETTER_WORDS } from './6-letters';

const MAPPING = {
  4: [FOUR_LETTER_WORD_BANK, VALID_FOUR_LETTER_WORDS],
  5: [FIVE_LETTER_WORD_BANK, VALID_FIVE_LETTER_WORDS],
  6: [SIX_LETTER_WORD_BANK, VALID_SIX_LETTER_WORDS],
};

const GAME_DATE = new Date();

/**
 * gets today's date in Eastern Time
 * @returns returns array of numbers [month, day, year] in Eastern Time
 */
const getMonthDayYearEST = () => {
  return GAME_DATE.toLocaleDateString('en-US', { timeZone: 'America/New_York' })
    .split('/')
    .map((num) => parseInt(num));
};

/**
 * gets today's time in Eastern Time
 * @returns returns array of numbers [hour, minute, second] in Eastern Time
 */
const getHourMinuteSecondEST = () => {
  const [time, timeOfDay] = GAME_DATE.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
  }).split(' ');
  let [hour, minute, second] = time.split(':').map((num) => parseInt(num));
  if (timeOfDay === 'PM') hour += 12;
  return [hour, minute, second];
};

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
 * gets daily puzzle based on desired number of letters
 * @param { number } numLetters
 * @returns daily puzzle
 */
export const getDailyPuzzle = (numLetters) => {
  const [month, day, year] = getMonthDayYearEST();
  const baseIndex = year * 365 + month * 31 + day;
  const [wordBank] = MAPPING[numLetters];
  return wordBank[baseIndex % wordBank.length];
};

/**
 * get random word from word bank
 * @param { number } numLetters
 * @returns random word from word bank
 */
export const getRandomWord = (numLetters) => {
  const [wordBank] = MAPPING[numLetters];
  return wordBank[Math.floor(Math.random() * wordBank.length)];
};

/**
 * check if guess is a real word
 * @param { array of objects } guess
 * @returns if guess is a real word
 */
export const isRealWord = (guess) => {
  const numLetters = guess.length;
  const word = guess.map((tile) => tile.letter).join('');
  const [wordBank, validWords] = MAPPING[numLetters];
  return wordBank.includes(word) || validWords.includes(word);
};

/**
LOCAL STORAGE GUIDE:
{
  GAME_DATE: 'MM/DD/YYYY',
  FOUR_DATA: {
    BOARD: board array of arrays of objects
    MAX_STREAK: number,
    STREAK: number,
    DISTRIBUTION: [number] * 6,
    SHOW_SHARE: boolean,
  },
  FIVE_DATA: {
    BOARD: board array of arrays of objects
    MAX_STREAK: number,
    STREAK: number,
    DISTRIBUTION: [number] * 6,
    SHOW_SHARE: boolean,
  },
  SIX_DATA: {
    BOARD: board array of arrays of objects
    MAX_STREAK: number,
    STREAK: number,
    DISTRIBUTION: [number] * 6,
    SHOW_SHARE: boolean,
  },
  GAME_MODE: number (4, 5, 6),
  DARK_MODE: boolean,
  HIGH_CONTRAST: boolean,
}
*/
