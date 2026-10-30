"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";

/**
 * PageGround owns the tint of the whole page. Anchors are section tops; the
 * background colour holds at each stop and blends into the next across a
 * short window just before the boundary, so the medium changes as one
 * continuous material instead of gradient strips bolted onto section edges.
 *
 * The stops are few and quiet — paper → panel → deep stops for the record.
 * They never fade to the light sheet at the end: the contact section carries
 * its own background and is laid over this ground with a real edge, so the
 * change of material is an object (a printed sheet) rather than a slow blur
 * between two colours.
 */

const STOPS: Array<[string, string]> = [
  ["#top", "#101114"],
  ["#work", "#101114"],
  ["#about", "#15161b"],
  ["#timeline", "#0a0b0e"],
  ["#recognition", "#0a0b0e"],
  ["#skills", "#101114"],
  ["#archive", "#131419"],
];

const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const mix = (a: string, b: string, t: number) => {
  const pa = hex(a);
  const pb = hex(b);
  // smoothstep so each blend eases in and out instead of running linearly
  const e = t * t * (3 - 2 * t);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * e));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

export function PageGround() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const ground = useMotionValue(STOPS[0][1]);
  const [points, setPoints] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const measure = () => {
      const pts: number[] = [];
      const cols: string[] = [];
      STOPS.forEach(([selector, color]) => {
        const el = document.querySelector(selector);
        if (el) {
          pts.push(scrollY.get() + el.getBoundingClientRect().top);
          cols.push(color);
        }
      });
      if (pts.length) {
        setPoints(pts);
        setColors(cols);
      }
    };

    measure();
    // fonts and images change layout; remeasure once the page has settled
    const timers = [700, 1800].map((ms) => setTimeout(measure, ms));
    window.addEventListener("resize", measure);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollY, "change", (v) => {
    if (!points.length) return;

    if (reduced) {
      // no animation: hard swap at each anchor, nothing in between
      let i = 0;
      for (let j = 1; j < points.length; j++) if (v >= points[j]) i = j;
      ground.set(colors[i]);
      return;
    }

    // hold at the current stop, then blend across a short window ending just
    // before the next anchor, so the new colour has arrived before its
    // content reaches the viewport
    let i = 0;
    for (let j = 1; j < points.length; j++) if (v >= points[j]) i = j;

    const end = points[i + 1];
    if (end === undefined) {
      ground.set(colors[i]);
      return;
    }
    const width = Math.min(260, Math.max(120, (end - points[i]) * 0.35));
    const t = Math.min(1, Math.max(0, (v - (end - width)) / width));
    ground.set(mix(colors[i], colors[i + 1], t));
  });

  return (
    <motion.div
      aria-hidden="true"
      className="ground"
      style={{ backgroundColor: ground, willChange: "background-color" }}
    />
  );
}
