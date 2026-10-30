"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Tech, TechGroup } from "@/lib/tech";

const EASE = [0.19, 1, 0.22, 1] as const;

export function SkillBoard({ groups }: { groups: TechGroup[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<{ tech: Tech; group: string } | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [glow, setGlow] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 210, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 210, damping: 24, mass: 0.4 });

  const move = (event: PointerEvent<HTMLLIElement>, tech: Tech, group: string) => {
    if (event.pointerType !== "mouse") return;
    const cardWidth = 214;
    const cardHeight = 178;
    const clampX = Math.min(event.clientX + 26, window.innerWidth - cardWidth - 18);
    const clampY = Math.min(
      Math.max(event.clientY - cardHeight / 2, 16),
      window.innerHeight - cardHeight - 16,
    );
    x.set(clampX);
    y.set(clampY);

    const board = boardRef.current;
    if (board) {
      const rect = board.getBoundingClientRect();
      board.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      board.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }
    setActive({ tech, group });
    setGlow(true);
  };

  const leaveChip = () => {
    setActive(null);
    setGlow(false);
  };

  return (
    <div
      className="skills-board"
      ref={boardRef}
      data-dimmed={hoveredGroup ? "true" : undefined}
      onPointerLeave={() => {
        setHoveredGroup(null);
        leaveChip();
      }}
    >
      <span className="skills-glow" aria-hidden="true" data-on={glow || undefined} />

      {groups.map((group, groupIndex) => (
        <motion.div
          key={group.name}
          className="skill-group"
          data-active={hoveredGroup === group.name || undefined}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHoveredGroup(group.name);
          }}
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, delay: groupIndex * 0.07, ease: EASE }}
        >
          <div className="skill-group__head">
            <h3 className="mono">{group.name}</h3>
            <span className="skill-group__count mono">
              {String(group.items.length).padStart(2, "0")}
            </span>
          </div>

          <p className="skill-group__note">{group.note}</p>

          <ul className="skill-grid">
            {group.items.map((tech, index) => (
              <motion.li
                key={tech.name}
                className="skill-chip"
                style={
                  {
                    "--brand": tech.brand ?? "var(--accent)",
                    "--logo": tech.logo ? `url(${tech.logo})` : "none",
                  } as CSSProperties
                }
                initial={reduced ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: groupIndex * 0.05 + index * 0.02,
                  ease: EASE,
                }}
                onPointerMove={(event) => move(event, tech, group.name)}
                onPointerLeave={leaveChip}
              >
                {tech.logo ? (
                  <span className="skill-chip__mark" aria-hidden="true" />
                ) : (
                  <span className="skill-chip__mono" aria-hidden="true">
                    {tech.mark}
                  </span>
                )}
                <span className="skill-chip__label">{tech.name}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}

      <AnimatePresence>
        {active && (
          <motion.div
            className="skill-card"
            aria-hidden="true"
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
          >
            <div
              className="skill-card__stage"
              style={{ "--brand": active.tech.brand ?? "var(--accent)" } as CSSProperties}
            >
              <span
                key={active.tech.name}
                className="skill-card__mark"
                style={
                  active.tech.logo
                    ? ({ "--logo": `url(${active.tech.logo})` } as CSSProperties)
                    : undefined
                }
                data-mono={active.tech.logo ? undefined : "true"}
              >
                {active.tech.logo ? null : active.tech.mark}
              </span>
              <span className="skill-card__rule" aria-hidden="true" />
              <span className="skill-card__group mono">{active.group}</span>
            </div>

            <div className="skill-card__foot">
              <span className="skill-card__name">{active.tech.name}</span>
              <span className="skill-card__idx mono">
                {String(
                  groups.flatMap((group) => group.items).findIndex((item) => item.name === active.tech.name) +
                    1,
                ).padStart(2, "0")}
                /{String(groups.reduce((total, group) => total + group.items.length, 0))}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
