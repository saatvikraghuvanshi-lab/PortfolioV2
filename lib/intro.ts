/**
 * Coordinates the opening curtain with the hero animation. The intro is the
 * only thing allowed to start the page; everything else waits for it.
 */
let finished = false;
const listeners = new Set<() => void>();

export function completeIntro() {
  if (finished) return;
  finished = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function whenIntroComplete(callback: () => void): () => void {
  if (finished) {
    callback();
    return () => {};
  }

  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function introHasFinished() {
  return finished;
}
