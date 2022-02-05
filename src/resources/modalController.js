import HowTo from './../components/Informational/HowTo.svelte';
import Leaderboard from './../components/Informational/Leaderboard.svelte';
import Settings from './../components/Informational/Settings.svelte';
import * as ModalController from './../components/Generic/Modal.svelte';
import { PAGES } from './constants.js';

export const openModalToPage = (page) => {
  ModalController.setOpen(true);
  switch (page) {
    case PAGES.HOWTO:
      ModalController.setContent(HowTo);
      break;
    case PAGES.LEADERBOARD:
      ModalController.setContent(Leaderboard);
      break;
    case PAGES.SETTINGS:
      ModalController.setContent(Settings);
      break;
  }
};
