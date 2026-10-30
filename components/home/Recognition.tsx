"use client";

import { motion } from "motion/react";
import { SectionHead } from "@/components/site/SectionHead";
import { useBelt } from "@/components/motion/useBelt";

const awards = [
  {
    year: "2026",
    title: "Cybersecurity & Cloud Computing Certificate",
    note: "Interns Elite — Azure, Docker, CI/CD, Linux",
    tag: "Certificate",
  },
  {
    year: "2026",
    title: "Bharatiya Antariksh Hackathon",
    note: "ISRO Problem Statement 8 — Lunar Ice Intelligence",
    tag: "Finalist",
  },
  {
    year: "2026",
    title: "Craft N Code",
    note: "Cyber Space Club, MUJ × Techfest IIIT Bhubaneswar — EcoCity Heat Planner",
    tag: "Round 00",
  },
  {
    year: "2026",
    title: "INDIA RUNS 2026 Ideathon",
    note: "Challenge 3: Improve Everyday Life with AI — ShockProof, team Noble Dawn",
    tag: "Participant",
  },
  {
    year: "2026",
    title: "AI Tools Workshop",
    note: "be10x — NotebookLM, Google Stitch, AI Studio, Claude, n8n",
    tag: "Certificate",
  },
  {
    year: "2025",
    title: "Startup Forge Ideathon",
    note: "GCEC Global Foundation",
    tag: "4th place",
  },
  {
    year: "2025",
    title: "Rewind & Recode National Hackathon",
    note: "JanSahayak — plus Robotics Workshop at Techfest IIT Bombay and WRC Quadcopter Challenge",
    tag: "Top 5",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 04 — the registry. Same belt as the showcase but read as a run of stamped
 * cards: the same drift, the same scroll response, and here the belt can also
 * be pulled by hand, because nothing on these cards is a link. The record
 * moves; the reading does not.
 */

export function Recognition() {
  const belt = useBelt({ speed: 26, direction: -1, brake: 0.1, draggable: true });

  const card = (award: (typeof awards)[number], index: number, copy: 0 | 1) => (
    <article
      key={`${copy}-${award.title}`}
      className="registry__card"
      aria-hidden={copy ? true : undefined}
    >
      <p className="registry__top mono">
        <span>Entry {pad(index + 1)}</span>
        <span>{award.year}</span>
      </p>

      <h3 className="registry__title">{award.title}</h3>
      <p className="registry__note">{award.note}</p>

      <div className="registry__foot">
        <span className="registry__tag mono">{award.tag}</span>
      </div>
    </article>
  );

  return (
    <section className="section shell" id="recognition">
      <SectionHead
        index="04"
        label="Recognition"
        title="Where the work has been tested."
        aside="2025 — 2026"
      />

      <div className="registry" {...belt.handlers}>
        <motion.div ref={belt.trackRef} className="registry__track" style={belt.style}>
          {awards.map((award, index) => card(award, index, 0))}
          {awards.map((award, index) => card(award, index, 1))}
        </motion.div>

        <div className="registry__edge" aria-hidden="true" />
      </div>

      <div className="registry__hint mono" aria-hidden="true">
        <span>{awards.length} entries · 2025 — 2026</span>
        <span>Pull the belt · scroll to speed it</span>
      </div>
    </section>
  );
}
