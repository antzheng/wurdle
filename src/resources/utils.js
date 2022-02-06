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
  hour = (hour % 12) + (timeOfDay === 'PM' ? 12 : 0);
  return [hour, minute, second];
};

/**
 * get total num of seconds into today
 * @returns total number of seconds into the current day
 */
export const getCurrentSecondsInTodayEST = () => {
  const [hrs, min, sec] = getHourMinuteSecondEST();
  return hrs * 3600 + min * 60 + sec;
};

export const getMonthDayYearESTString = () => {
  return getMonthDayYearEST()
    .map((num) => String(num))
    .join('/');
};

/**
 * return if user has won the game
 * @param { array of strings } board
 * @param { string } solution
 * @returns if user has won the game
 */
export const isWin = (board, solution) => {
  return board[board.length - 1] === solution;
};

/**
 * returns if user has lost the game
 * @param { array of strings } board
 * @returns if user has lost the game
 */
export const isLoss = (board) => {
  return board.length >= 6;
};

/**
 * returns if the game has ended
 * @param { array of strings} board
 * @param { string } solution
 * @returns if the game is over (win or loss)
 */
export const isGameOver = (board, solution) => {
  return isWin(board, solution) || isLoss(board);
};

/**
 * sets the state for each letter of the rendered board
 * @param { list of objects containing { state, letter } } word
 * @param { solution } solution
 */
const validateWord = (word, solution) => {
  // fill in frequency map
  const freq = {};
  for (const letter of solution) {
    if (!freq.hasOwnProperty(letter)) freq[letter] = 0;
    freq[letter] += 1;
  }

  // place correct guesses
  word.forEach((tile, i) => {
    if (tile.letter === solution[i]) {
      tile.state = 'correct';
      freq[tile.letter] -= 1;
    } else {
      tile.state = 'absent';
    }
  });

  // find misplaced letters
  word.forEach((tile) => {
    if (tile.state === 'absent' && freq[tile.letter] > 0) {
      tile.state = 'present';
      freq[tile.letter] -= 1;
    }
  });
};

/**
 * sets up the rendered board
 * @param { array of strings } board
 * @param { string } currentGuess
 * @param { string } solution
 * @returns an array of data used to render the game board
 */
export const getRenderedBoard = (board, currentGuess, solution) => {
  // rendered board contains previous guesses + current guess
  const rendered = [...board, currentGuess].map((row) =>
    [...row].map((letter) => ({ letter, state: 'tbd' }))
  );

  // rendered board must validate previous guesses
  for (let i = 0; i < board.length; i++) {
    validateWord(rendered[i], solution);
  }

  // rendered board cannot exceed 6 rows
  return rendered.slice(0, 6);
};

/**
 * sets up the keyboard state
 * @param { array of strings } board
 * @param { strings } solution
 * @returns an object representing the states of each character on the keyboard
 */
export const getKeyboardState = (board, solution) => {
  const state = {};

  // get all absent letters
  board.forEach((word) => {
    [...word].forEach((letter) => {
      if (!solution.includes(letter)) {
        state[letter] = 'absent';
      }
    });
  });

  // get all present letters
  board.forEach((word) => {
    [...word].forEach((letter, i) => {
      if (solution.includes(letter) && solution[i] !== letter) {
        state[letter] = 'present';
      }
    });
  });

  // get all correct letters
  board.forEach((word) => {
    [...word].forEach((letter, i) => {
      if (solution[i] === letter) {
        state[letter] = 'correct';
      }
    });
  });

  return state;
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
 * @param { string } guess
 * @returns if guess is a real word
 */
export const isRealWord = (guess) => {
  const numLetters = guess.length;
  const [wordBank, validWords] = MAPPING[numLetters];
  return wordBank.includes(guess) || validWords.includes(guess);
};

/**
LOCAL STORAGE GUIDE:
{
  gameMode: number (4, 5, 6),
  isDarkMode: boolean,
  isHighContrast: boolean,
  fourMode: {
    fromDate: 'MM/DD/YYYY',
    board: array of strings
    maxStreak: number,
    streak: number,
    distribution: [number] * 7,
  },
  fiveMode: {
    fromDate: 'MM/DD/YYYY',
    board: array of strings
    maxStreak: number,
    streak: number,
    distribution: [number] * 7,
  },
  sixMode: {
    fromDate: 'MM/DD/YYYY',
    board: array of strings
    maxStreak: number,
    streak: number,
    distribution: [number] * 7,
  },
}
*/

/**
 * gets settings from local storage
 * @returns { gameMode: number, isDarkMode: boolean, isHighContrast: boolean }
 */
export const getSettingsFromStorage = () => {
  // default values
  const defaultGameMode = 5;
  const defaultHighContrast = false;
  const defaultDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  // try getting from storage
  try {
    let [gameMode, isDarkMode, isHighContrast] = [
      'gameMode',
      'isDarkMode',
      'isHighContrast',
    ].map((key) => JSON.parse(window.localStorage.getItem(key)));

    // validate gameMode
    if (typeof gameMode !== 'number' || ![4, 5, 6].includes(gameMode)) {
      gameMode = defaultGameMode;
    }

    // validate isDarkMode
    if (typeof isDarkMode !== 'boolean') {
      isDarkMode = defaultDarkMode;
    }

    // validate isHighContrast
    if (typeof isHighContrast !== 'boolean') {
      isHighContrast = defaultHighContrast;
    }

    return {
      gameMode,
      isDarkMode,
      isHighContrast,
    };
  } catch (e) {
    return {
      gameMode: defaultGameMode,
      isDarkMode: defaultDarkMode,
      isHighContrast: defaultHighContrast,
    };
  }
};

/**
 * sets settigns in local storage
 * @param { number } gameMode
 * @param { boolean } isDarkMode
 * @param { boolean } isHighContrast
 */
export const setSettingsInStorage = (gameMode, isDarkMode, isHighContrast) => {
  window.localStorage.setItem('gameMode', JSON.stringify(gameMode));
  window.localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  window.localStorage.setItem('isHighContrast', JSON.stringify(isHighContrast));
};

/**
 * get board from local storage
 * @param { number } gameMode
 * @returns board from local storage based on gameMode
 */
export const getBoardFromStorage = (gameMode) => {
  const mapping = {
    4: 'fourMode',
    5: 'fiveMode',
    6: 'sixMode',
  };
  try {
    const data = JSON.parse(window.localStorage.getItem(mapping[gameMode]));
    const today = getMonthDayYearESTString();

    const isDateMatch = today === data.fromDate;
    const isValidBoard = data.board.every(
      (word) => word.length === gameMode && isRealWord(word)
    );

    return isDateMatch && isValidBoard ? data.board : [];
  } catch (e) {
    return [];
  }
};

/**
 * save the current board in local storage
 * @param { number } gameMode
 * @param { array of strings } board
 */
export const setBoardInStorage = (gameMode, board) => {
  const mapping = {
    4: 'fourMode',
    5: 'fiveMode',
    6: 'sixMode',
  };
  const today = getMonthDayYearESTString();

  try {
    const data = JSON.parse(window.localStorage.getItem(mapping[gameMode]));

    data.fromDate = today;
    data.board = board;

    window.localStorage.setItem(mapping[gameMode], JSON.stringify(data));
  } catch (e) {
    const defaultData = {
      fromDate: today,
      board,
      maxStreak: 0,
      streak: 0,
      distribution: Array(7).fill(0),
    };
    window.localStorage.setItem(mapping[gameMode], JSON.stringify(defaultData));
  }
};

/**
 * get stats from local storage
 * @param { number } gameMode
 * @returns stats from local storage related to game mode
 */
export const getStatsFromStorage = (gameMode) => {
  const mapping = {
    4: 'fourMode',
    5: 'fiveMode',
    6: 'sixMode',
  };
  try {
    const data = JSON.parse(window.localStorage.getItem(mapping[gameMode]));
    let { maxStreak, streak, distribution } = data;

    // validate maxStreak
    if (typeof maxStreak !== 'number') {
      maxStreak = 0;
    }

    // validate streak
    if (typeof streak !== 'number') {
      streak = 0;
    }

    // validate guess distributions
    if (
      distribution.length !== 7 ||
      distribution.some((val) => typeof val !== 'number')
    ) {
      distribution = Array(7).fill(0);
    }

    return {
      maxStreak,
      streak,
      distribution,
    };
  } catch (e) {
    return {
      maxStreak: 0,
      streak: 0,
      distribution: Array(7).fill(0),
    };
  }
};

/**
 * update stats in local storage for gameMode
 * @param { number } gameMode
 * @param { number } numGuesses
 */
export const setStatsInStorage = (gameMode, numGuesses) => {
  const mapping = {
    4: 'fourMode',
    5: 'fiveMode',
    6: 'sixMode',
  };
  const today = getMonthDayYearESTString();

  try {
    const data = JSON.parse(window.localStorage.getItem(mapping[gameMode]));

    // increase or reset streak based on win or loss
    data.streak = numGuesses > 0 ? data.streak + 1 : 0;

    // set maxStreak
    data.maxStreak = Math.max(data.maxStreak, data.streak);

    // update guess distribution
    data.distribution[numGuesses] += 1;

    // put back into local storage
    window.localStorage.setItem(mapping[gameMode], JSON.stringify(data));
  } catch (e) {
    const defaultData = {
      fromDate: today,
      board: [],
      maxStreak: 0,
      streak: 0,
      distribution: Array(7).fill(0),
    };
    window.localStorage.setItem(mapping[gameMode], JSON.stringify(defaultData));
  }
};
