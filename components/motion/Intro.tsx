"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { completeIntro } from "@/lib/intro";
import { lockScroll, type ScrollLockRelease } from "@/lib/scroll-lock";
import { site } from "@/lib/site";

/**
 * The opening is not a title card, it is the file being read: the eight
 * exhibits sit as an index, a signal line passes down over them and lights
 * each one with its year while a counter keeps the tally. When the last one is
 * read the panel is cut into four horizontal bands that lift in a wave, so the
 * hero arrives the way the showcase does — as a belt.
 *
 * Rendered from the server, so it is what the browser paints rather than a
 * panel that appears over the page a moment later. One run per session, any
 * click skips it, and a reduced-motion preference hides it entirely (the
 * layout hides it before paint in both of those cases).
 */

const STEP = 120; // ms each exhibit holds the scan
const HOLD = 240; // ms after the last row before the shutter opens
const BANDS = 4;
const BAND_MS = 950;
const BAND_DELAY = 120;
const BAND_STAGGER = 75;

const pad = (n: number) => String(n).padStart(2, "0");

export function Intro() {
  const [present, setPresent] = useState(true);
  const [closing, setClosing] = useState(false);
  const [read, setRead] = useState(0);
  const reduced = useReducedMotion();
  const releaseRef = useRef<ScrollLockRelease | null>(null);
  const timers = useRef<number[]>([]);

  const close = useCallback(() => {
    sessionStorage.setItem("sr-intro", "1");
    completeIntro();
    releaseRef.current?.();
    releaseRef.current = null;
    setClosing(true);
    const done = window.setTimeout(
      () => setPresent(false),
      BAND_DELAY + BAND_STAGGER * BANDS + BAND_MS,
    );
    timers.current.push(done);
  }, []);

  useEffect(() => {
    if (reduced || sessionStorage.getItem("sr-intro") === "1") {
      completeIntro();
      setPresent(false);
      return;
    }

    const total = projects.length;
    releaseRef.current = lockScroll();

    const tick = window.setInterval(() => {
      setRead((value) => Math.min(total, value + 1));
    }, STEP);
    const end = window.setTimeout(close, total * STEP + HOLD);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(end);
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      releaseRef.current?.();
      releaseRef.current = null;
    };
  }, [close, reduced]);

  if (!present) return null;

  const total = projects.length;
  const scanDuration = (total * STEP) / 1000;

  return (
    <div
      className={`loader${closing ? " is-closing" : ""}`}
      role="presentation"
      onClick={close}
    >
      <div className="loader__bands" aria-hidden="true">
        {Array.from({ length: BANDS }).map((_, band) => (
          <span
            key={band}
            className="loader__band"
            style={{
              transform: closing ? "translateY(-101%)" : "translateY(0)",
              transition: `transform ${BAND_MS}ms cubic-bezier(0.76, 0, 0.24, 1) ${
                BAND_DELAY + band * BAND_STAGGER
              }ms`,
            }}
          />
        ))}
      </div>

      <div className="loader__inner">
        <div className="loader__top mono">
          <span>{site.name}</span>
          <span>Portfolio — 2026</span>
        </div>

        <div className="loader__mid">
          <div className="loader__head mono">
            <span>Opening the file</span>
            <span>{pad(total)} exhibits</span>
          </div>

          <div className="loader__manifest">
            <motion.i
              className="loader__scan"
              aria-hidden="true"
              initial={{ top: "0%", opacity: 1 }}
              animate={{ top: "100%", opacity: read >= total ? 0 : 1 }}
              transition={{
                top: { duration: scanDuration, ease: "linear" },
                opacity: { duration: 0.35 },
              }}
            />

            <ol className="loader__list">
              {projects.map((project, index) => (
                <li
                  key={project.slug}
                  className={`loader__row${index < read - 1 ? " is-read" : ""}${
                    index === read - 1 ? " is-live" : ""
                  }`}
                >
                  <span className="mono">{pad(index + 1)}</span>
                  <span className="loader__name">{project.shortTitle}</span>
                  <span className="mono">{project.year}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="loader__foot">
          <div className="loader__track" aria-hidden="true">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={{ scaleX: read / total }}
              transition={{ duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
            />
          </div>
          <div className="loader__top mono">
            <span>
              {pad(read)} / {pad(total)}
            </span>
            <span>{read >= total ? "Ready" : "Reading"}</span>
            <span>Jaipur, IN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
