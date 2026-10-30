"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.19, 1, 0.22, 1] as const;

type SectionHeadProps = {
  index: string;
  label: string;
  title: ReactNode;
  aside: string;
};

/**
 * Section headers animate as three separate beats: the label slides in, the
 * title unmasks upward, the aside fades. Kept as direct children so the grid
 * layout of .section__head is untouched.
 */
export function SectionHead({ index, label, title, aside }: SectionHeadProps) {
  const reduced = useReducedMotion();
  const viewport = { once: true, margin: "0px 0px -12% 0px" };

  return (
    <div className="section__head">
      <motion.span
        className="section__label mono"
        initial={reduced ? undefined : { opacity: 0, x: -12 }}
        whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
        viewport={viewport}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <i className="dot" aria-hidden="true" />
        {index} / {label}
      </motion.span>

      <motion.h2
        className="section__title"
        initial={reduced ? undefined : { opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
        viewport={viewport}
        transition={{ duration: 1, delay: 0.06, ease: EASE }}
      >
        {title}
      </motion.h2>

      <motion.span
        className="section__aside mono"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
      >
        {aside}
      </motion.span>
    </div>
  );
}
