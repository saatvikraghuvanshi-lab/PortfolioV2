"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { whenIntroComplete } from "@/lib/intro";
import { ArrowDown } from "@/components/icons";

const EASE = [0.19, 1, 0.22, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => whenIntroComplete(() => setReady(true)), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  const lines = ["Saatvik", "Raghuvanshi"];
  const facts = ["B.Tech CSE · Class of 2029", "Full-stack · Interface · GIS", "Jaipur, India"];

  return (
    <section className="hero shell" id="top" ref={ref} aria-label="Introduction">
      <motion.div
        className="hero__top mono"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
      >
        <span>Portfolio — MMXXVI</span>
        <span className="hero__status">
          <i className="dot" aria-hidden="true" />
          {site.availability}
        </span>
      </motion.div>

      <motion.div
        className="hero__name"
        style={reduced ? undefined : { y: nameY, opacity: nameOpacity }}
      >
        <h1>
          {lines.map((line, index) => (
            <span className="line" key={line}>
              <motion.span
                initial={reduced ? undefined : { y: "112%", filter: "blur(10px)" }}
                animate={ready || reduced ? { y: "0%", filter: "blur(0px)" } : undefined}
                transition={{ duration: 1.4, delay: index * 0.14, ease: EASE }}
              >
                {index === 1 ? (
                  <>
                    Raghu<em>vanshi</em>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.figure
        className="hero__portrait"
        style={{ y: portraitY }}
        initial={reduced ? undefined : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        animate={ready ? { clipPath: "inset(0 0 0% 0)", opacity: 1 } : undefined}
        transition={{
          clipPath: { duration: 1.5, delay: 0.28, ease: EASE },
          opacity: { duration: 0.6, delay: 0.28, ease: "linear" },
        }}
      >
        <motion.img
          src="/profile/saatvik.webp"
          alt="Portrait of Saatvik Raghuvanshi"
          width={600}
          height={800}
          fetchPriority="high"
          decoding="async"
          style={{ scale: portraitScale }}
        />
        <figcaption>Jaipur · 2026</figcaption>
      </motion.figure>

      <motion.div
        className="hero__meta"
        initial={reduced ? undefined : { opacity: 0, y: 18 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
      >
        <p className="hero__intro">
          Computer science undergrad at <strong>Manipal University Jaipur</strong>. I build
          full-stack, geospatial and AI-assisted products — and put the receipts beside
          every claim.
        </p>

        <ul className="hero__facts mono">
          {facts.map((fact, index) => (
            <motion.li
              key={fact}
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.85, delay: 0.5 + index * 0.1, ease: EASE }}
            >
              {fact}
            </motion.li>
          ))}
        </ul>

        <a className="hero__scroll mono" href="#work" aria-label="Scroll to selected work">
          <span>Scroll</span>
          <i aria-hidden="true" />
          <ArrowDown size={13} />
        </a>
      </motion.div>
    </section>
  );
}
