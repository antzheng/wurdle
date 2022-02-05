<script>
  import { onMount } from 'svelte';
  import CloseIcon from 'svelte-icons/io/IoMdClose.svelte';
  import ShareIcon from 'svelte-icons/io/IoMdShare.svelte';
  import { ToastController } from './../Generic/Toast.svelte';
  import * as ModalController from './../Generic/Modal.svelte';
  import * as utils from './../../resources/utils';

  // props
  export let gameMode;

  // state
  let currentTime = utils.getCurrentSecondsInTodayEST();
  $: remainingTime = calculateRemainingTime(currentTime);

  // derived values
  $: [numLetters] = gameMode;

  $: board = utils.getBoardFromStorage(numLetters);
  $: solution = utils.getDailyPuzzle(numLetters);

  $: stats = utils.getStatsFromStorage(numLetters);
  $: guessDistribution = stats.distribution.slice(1);

  $: losses = stats.distribution[0];
  $: wins = guessDistribution.reduce((prev, curr) => prev + curr, 0);
  $: played = wins + losses;
  $: winPercent = played > 0 ? 100 * (wins / played) : 0;
  $: maxGuess = guessDistribution.reduce((p, c) => Math.max(p, c), 0);

  $: statsData = [
    { stat: played, label: 'Played' },
    { stat: winPercent, label: 'Win %' },
    { stat: stats.streak, label: 'Current Streak' },
    { stat: stats.maxStreak, label: 'Max Streak' },
  ];

  // handlers
  const calculateRemainingTime = (currentTime) => {
    let seconds = 86400 - currentTime;

    // calculate hours
    let hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;

    // calculate minutes
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return [hours, minutes, seconds]
      .map((time) => String(time).padStart(2, '0'))
      .join(':');
  };

  const shareBoard = async () => {
    // set up first line
    const today = utils.getMonthDayYearESTString();
    const firstLine = `Wurdle ${today}`;

    // set up second line
    const tries = utils.isWin(board, solution) ? board.length : 'X';
    const secondLine = `${numLetters}-Letter Mode ${tries}/6`;

    // set up grid string
    const stateMapping = {
      absent: '⬜️',
      present: '🟨',
      correct: '🟩',
    };
    const gridString = utils
      .getRenderedBoard(board, '', solution)
      .map((row) => row.map(({ state }) => stateMapping[state]).join(''))
      .join('\n');

    // full message
    const message = `${firstLine}\n\n${secondLine}\n\n${gridString}`;
    const shareData = {
      title: 'Wurdle',
      text: message,
      url: 'https://antzheng.github.io/wurdle/',
    };

    // share
    try {
      await navigator.share(shareData);
    } catch (e) {
      try {
        navigator.clipboard.writeText(message);
        ToastController.push('Copied to Clipboard!');
      } catch (e) {
        ToastController.push('Something went wrong!');
      }
    }
  };

  // lifecycle
  onMount(() => {
    const tick = () => (currentTime += 1);
    setInterval(tick, 1000);
    return () => clearInterval(tick);
  });
</script>

<div class="content">
  <header>
    <h1>STATS</h1>
    <button class="button" on:click={() => ModalController.setOpen(false)}>
      <CloseIcon />
    </button>
  </header>

  <p class="title">{numLetters}-Letter Mode</p>
  <div class="statistics">
    {#each statsData as data}
      <div class="statistic-container">
        <div class="statistic">{data.stat}</div>
        <div class="label">{data.label}</div>
      </div>
    {/each}
  </div>

  <p class="title">Guess Distribution</p>
  <div class="guess-distribution">
    {#each guessDistribution as guess, i}
      <div class="graph-container">
        <div class="guess">{i + 1}</div>
        <div class="graph">
          <div
            class="graph-bar"
            class:align-right={guess > 0}
            class:highlight={utils.isWin(board, solution) &&
              board.length - 1 === i}
            style="width:{(100 * guess) / maxGuess}%;"
          >
            <div class="num-guesses">{guess}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if utils.isGameOver(board, solution)}
    <div class="footer">
      <div class="countdown">
        <p class="title mini">Next Wurdle</p>
        <div class="timer">{remainingTime}</div>
      </div>
      <div class="share">
        <button class="share-button" on:click={shareBoard}>
          Share
          <div class="svg">
            <ShareIcon />
          </div>
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .content {
    width: 100%;
    height: 100%;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .title {
    font-weight: bold;
    font-size: 1.1rem;
    text-align: center;
    margin: 30px 0;
  }

  .mini {
    margin: 5px 0;
  }

  .button {
    color: var(--color-tone-3);
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    transform: translateX(-50%);
  }

  .statistics {
    padding-bottom: 20px;
    display: flex;
    width: 80%;
  }

  .statistic-container {
    flex: 1;
  }

  .statistic {
    font-size: 36px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    letter-spacing: 0.05em;
    font-variant-numeric: proportional-nums;
  }

  .label {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .guess-distribution {
    padding-bottom: 20px;
    width: 80%;
  }

  .graph-container {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    padding-bottom: 4px;
    font-size: 14px;
    line-height: 20px;
  }

  .graph {
    width: 100%;
    height: 100%;
    padding-left: 10px;
  }

  .graph-bar {
    height: 100%;
    width: 0;
    min-width: 8%;
    position: relative;
    background-color: var(--color-absent);
    display: flex;
    justify-content: center;
  }

  .align-right {
    justify-content: flex-end;
    padding-right: 10px;
  }

  .highlight {
    background-color: var(--color-correct);
  }

  .num-guesses {
    font-weight: bold;
    color: var(--tile-text-color);
  }

  .footer {
    display: flex;
    width: 100%;
    padding-bottom: 30px;
  }

  .countdown {
    border-right: 1px solid var(--color-tone-1);
    padding-right: 12px;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .share {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 12px;
    width: 50%;
  }

  .share-button {
    background-color: var(--key-bg-correct);
    color: var(--key-evaluated-text-color);
    font-family: inherit;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
    width: 80%;
    font-size: 20px;
    height: 52px;
  }

  .timer {
    font-variant-numeric: initial;
    font-size: 36px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    letter-spacing: 0.05em;
    margin: 5px 0;
  }

  .svg {
    margin-left: 10px;
    width: 25px;
    height: 25px;
  }

  @media (max-width: 500px) {
    .timer {
      font-size: 1.5rem;
    }

    .svg {
      height: 15px;
      width: 15px;
    }

    .share-button {
      font-size: 0.8rem;
    }
  }
</style>
