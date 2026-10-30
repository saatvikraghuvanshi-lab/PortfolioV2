"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHead } from "@/components/site/SectionHead";
import { Recognition } from "@/components/home/Recognition";

const EASE = [0.19, 1, 0.22, 1] as const;

const timeline = [
  {
    when: "2026 — Present",
    what: "Freelance full-stack developer",
    org: "Independent · Remote",
    desc: "Building and shipping websites and product demos end to end — frontend, UI/UX, backend, database design, deployment and the maintenance that comes after.",
  },
  {
    when: "May — Jul 2026",
    what: "Cloud Computing & Cybersecurity Intern",
    org: "InternsElite · Remote · 3 months",
    desc: "Azure, Docker, CI/CD pipelines, Linux and cloud security fundamentals, applied to deployed workloads rather than slideware.",
  },
  {
    when: "2025 — 2029",
    what: "B.Tech, Computer Science and Engineering",
    org: "Manipal University Jaipur",
    desc: "Current GPA 7.0. Coursework alongside a steady stream of hackathons, ideathons and independent builds.",
  },
  {
    when: "Class 10 / 12",
    what: "Schooling",
    org: "Army Public School · Resonance",
    desc: "Class 10: 86% at Army Public School. Class 12: 82% at Resonance.",
  },
];

/* 03 and 04 live inside one dark slab: the record printed on ink, and the
   registry below it as a belt rather than a list. Rows enter with a short
   cascade; the belt's own component owns its motion. */

export function Background() {
  const reduced = useReducedMotion();

  const row = (index: number, step: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -9% 0px" },
          transition: { duration: 0.85, delay: (index % 4) * step, ease: EASE },
        };

  return (
    <div className="band band--ink">
      <section className="section shell" id="timeline">
        <SectionHead
          index="03"
          label="Background"
          title={
            <>
              Education, work, and the <span className="italic accent">evidence</span>.
            </>
          }
          aside="Reverse chronological"
        />

        <div>
          {timeline.map((item, index) => (
            <motion.div key={item.what} className="timeline__row" {...row(index, 0.06)}>
              <span className="timeline__when mono">{item.when}</span>
              <div className="timeline__what">
                <h3>{item.what}</h3>
                <p className="timeline__org mono">{item.org}</p>
                <p className="timeline__desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Recognition />
    </div>
  );
}
