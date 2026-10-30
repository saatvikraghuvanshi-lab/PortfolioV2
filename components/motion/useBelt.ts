"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react";

/**
 * The belt: two copies of one row laid end to end inside a seamless loop. A
 * frame loop drifts it at an idle rate, page-scroll velocity multiplies that
 * rate (and can flip its direction), and resting a pointer on it brakes it to
 * a crawl so a plate can be read or clicked. When `draggable` is set the belt
 * can also be pulled by hand — used where the cards are not links, so a drag
 * never fights a click.
 *
 * x always lives in (-halfWidth, 0]; wrapping happens on every write so the
 * loop has no seam and a hard flick cannot escape it.
 *
 * Under prefers-reduced-motion the loop is skipped entirely and the strip
 * becomes a normal horizontal scroller (see the component CSS).
 */

type BeltOptions = {
  /** idle drift, in pixels per second */
  speed: number;
  /** 1 drifts toward the left edge, -1 toward the right */
  direction?: 1 | -1;
  /** multiplier applied while a pointer rests on the belt */
  brake?: number;
  /** allow the belt to be pulled by hand */
  draggable?: boolean;
};

export function useBelt({ speed, direction = 1, brake = 0.12, draggable = false }: BeltOptions) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const hovered = useRef(false);
  const drag = useRef<{ from: number; value: number; active: boolean } | null>(null);
  const [halfWidth, setHalfWidth] = useState(0);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 110, damping: 32, mass: 0.6 });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      // the loop distance is exactly the offset between the first card of
      // each copy — scrollWidth/2 drifts by whatever padding the track keeps,
      // which shows up as a small hitch once every full revolution
      const children = track.children;
      const half = children.length / 2;
      const first = children[0] as HTMLElement | undefined;
      const second = children[half] as HTMLElement | undefined;
      const width =
        Number.isInteger(half) && first && second
          ? second.offsetLeft - first.offsetLeft
          : track.scrollWidth / 2;
      if (width > 0) setHalfWidth(width);
    };

    measure();
    // fonts and images settle late; watch the track instead of guessing
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const wrap = (value: number) => {
    if (!halfWidth) return value;
    return (((value % halfWidth) + halfWidth) % halfWidth) - halfWidth;
  };

  useAnimationFrame((_, delta) => {
    if (reduced || !halfWidth || drag.current) return;
    const dt = Math.min(delta, 50) / 1000;

    let rate = speed * (hovered.current ? brake : 1);
    const v = smoothVelocity.get();
    if (Math.abs(v) > 240) rate *= Math.min(4.5, Math.abs(v) / 240);
    // a hard upward scroll flips the belt, so the page and the belt agree
    const sign = v < -700 ? -1 : 1;

    x.set(wrap(x.get() + direction * sign * rate * dt));
  });

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { from: event.clientX, value: x.get(), active: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.from;
    // a small dead zone keeps a vertical swipe as a page scroll
    if (!state.active) {
      if (Math.abs(dx) < 8) return;
      state.active = true;
    }
    x.set(state.value + dx);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    x.set(wrap(x.get()));
  };

  return {
    trackRef,
    x,
    halfWidth,
    style: reduced ? undefined : { x },
    handlers: {
      onPointerEnter: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") hovered.current = true;
      },
      onPointerLeave: () => {
        hovered.current = false;
      },
      ...(draggable
        ? {
            onPointerDown,
            onPointerMove,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
          }
        : {}),
    },
  };
}
