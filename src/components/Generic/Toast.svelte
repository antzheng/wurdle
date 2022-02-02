<script context="module">
  export const ToastController = toast;
</script>

<script>
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';

  const options = {
    duration: 1000, // duration of progress bar tween to the `next` value
    initial: 1, // initial progress bar value
    next: 0, // next progress value
    pausable: false, // pause progress bar tween on mouse hover
    dismissable: true, // allow dismiss with close button
    reversed: false, // insert new toast to bottom of stack
    intro: { y: -1000 }, // toast intro fly animation settings
  };
</script>

<SvelteToast {options} />

<style lang="scss">
  :root {
    --toastContainerTop: 4rem;
    --toastContainerRight: auto;
    --toastContainerBottom: auto;
    --toastContainerLeft: calc(50vw - 8rem);
  }

  :global(._toastMsg) {
    font-weight: bold;
  }
</style>
