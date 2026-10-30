"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  pad?: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

/**
 * Counts up once when scrolled into view. Server-rendered markup carries the
 * final value, so it still reads correctly without JavaScript.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  pad,
  suffix = "",
  className,
  duration = 1.5,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  const format = (input: number) => {
    const rounded = decimals > 0 ? input.toFixed(decimals) : String(Math.round(input));
    const padded = pad ? rounded.padStart(pad, "0") : rounded;
    return `${padded}${suffix}`;
  };

  useEffect(() => {
    if (!inView || !ref.current || reduced) return;

    const node = ref.current;
    node.textContent = format(0);

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
      onComplete: () => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
