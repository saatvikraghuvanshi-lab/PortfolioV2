"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * The cover drifts slightly against the scroll while staying inside its
 * frame. Transform-only, so it never triggers layout.
 */
export function ParallaxCover({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <figure className="case__cover case__cover--parallax" ref={ref}>
      <motion.img src={src} alt={alt} style={reduced ? undefined : { y, scale: 1.1 }} />
    </figure>
  );
}
