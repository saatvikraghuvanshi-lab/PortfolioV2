"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Shot } from "@/lib/projects";
import { lockScroll } from "@/lib/scroll-lock";
import { ArrowLeft, ArrowRight, Close } from "@/components/icons";

const EASE = [0.19, 1, 0.22, 1] as const;

export function Gallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        return (current + delta + shots.length) % shots.length;
      });
    },
    [shots.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const release = lockScroll();
    window.addEventListener("keydown", onKey);

    return () => {
      release();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  if (!shots.length) return null;

  const active = open === null ? null : shots[open];

  return (
    <>
      <div className="gallery">
        {shots.map((shot, index) => (
          <motion.button
            key={shot.src}
            type="button"
            className="gallery__item"
            onClick={() => setOpen(index)}
            aria-label={`View screenshot: ${shot.caption}`}
            data-cursor="View"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.85, delay: Math.min(index * 0.06, 0.42), ease: EASE }}
          >
            <span className="gallery__frame">
              <img src={shot.src} alt={shot.caption} loading="lazy" decoding="async" />
            </span>
            <span className="gallery__cap">
              <span>{shot.caption}</span>
              <em>
                {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
              </em>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && open !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Screenshot viewer — ${active.caption}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(null)}
          >
            <div className="lightbox__top mono">
              <span>{active.caption}</span>
              <button
                type="button"
                className="lightbox__btn"
                onClick={() => setOpen(null)}
                aria-label="Close viewer"
              >
                <Close size={15} />
              </button>
            </div>

            <motion.div
              className="lightbox__stage"
              onClick={(event) => event.stopPropagation()}
              key={active.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) step(1);
                else if (info.offset.x > 70) step(-1);
              }}
            >
              <img src={active.src} alt={active.caption} draggable={false} />
            </motion.div>

            <div className="lightbox__bottom mono">
              <span>
                {String(open + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
              </span>
              <div className="lightbox__nav">
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous screenshot"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next screenshot"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
