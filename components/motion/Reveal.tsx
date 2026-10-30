"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealVariant = "rise" | "wipe" | "fade";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  variant?: RevealVariant;
};

const EASE = [0.19, 1, 0.22, 1] as const;

function preset(variant: RevealVariant, y: number) {
  switch (variant) {
    case "wipe":
      return {
        hidden: { opacity: 0, y, clipPath: "inset(0 0 100% 0)" },
        visible: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
      };
    case "fade":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    default:
      return {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      };
  }
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  variant = "rise",
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={preset(variant, y)}
      transition={{
        duration: variant === "wipe" ? 1.05 : 0.9,
        delay,
        ease: EASE,
      }}
      style={variant === "wipe" ? { willChange: "clip-path" } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function Rule({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="rule"
      initial={reduced ? undefined : { scaleX: 0, transformOrigin: "left" }}
      whileInView={reduced ? undefined : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      aria-hidden="true"
    />
  );
}
