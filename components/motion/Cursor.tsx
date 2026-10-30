"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Contextual cursor: a dot for precision, a ring for targets, and a filled
 * label ("View", "Open") when an element asks for it via data-cursor.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.35 });
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.2 });
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as HTMLElement | null;
      const labelled = target?.closest?.("[data-cursor]") as HTMLElement | null;

      setLabel(labelled ? labelled.dataset.cursor ?? null : null);
      setActive(Boolean(target?.closest("a, button, [data-cursor]")));
    };

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        className="cursor cursor--dot"
        style={{ x: dotX, y: dotY, opacity: label ? 0 : 1 }}
        aria-hidden="true"
      />
      <motion.div
        className="cursor cursor--ring"
        style={{ x: ringX, y: ringY }}
        data-active={active}
        data-label={label ?? undefined}
        aria-hidden="true"
      />
    </>
  );
}
