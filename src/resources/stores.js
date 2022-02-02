import { writable } from 'svelte/store';

/**
 * global state for generic modal component
 */
export const ModalStore = {
  isOpen: writable(false),
  content: writable(null),
};
