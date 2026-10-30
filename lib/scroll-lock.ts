/**
 * Token-based scroll lock shared by the intro, mobile menu and lightbox.
 * Each caller gets its own idempotent release function, so double-invoked
 * effects or unmounts can never strand the page in a locked state.
 */
export type ScrollLockRelease = () => void;

let locks = 0;

export function lockScroll(): ScrollLockRelease {
  if (typeof document === "undefined") return () => {};

  locks += 1;
  if (locks === 1) {
    document.body.classList.add("is-locked");
    window.dispatchEvent(new Event("sr:lock"));
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);

    if (locks === 0) {
      document.body.classList.remove("is-locked");
      window.dispatchEvent(new Event("sr:unlock"));
    }
  };
}
