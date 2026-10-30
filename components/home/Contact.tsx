"use client";

import { motion, useReducedMotion } from "motion/react";
import { site, social } from "@/lib/site";
import { Download } from "@/components/icons";

const EASE = [0.19, 1, 0.22, 1] as const;

/* The closing slab: oxblood carried at full strength, cream type, and the
   email as the largest object on the block. Structurally the same ledger as
   before — but as a back cover, not one more section of paper. */

const lines = [
  <>Let us build</>,
  <>
    <em>something useful.</em>
  </>,
];

export function Contact() {
  const reduced = useReducedMotion();

  return (
    <section className="contact" id="contact">
      <div className="shell">
        <motion.p
          className="contact__eyebrow mono"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <i className="dot" aria-hidden="true" />
          07 / Contact
        </motion.p>

        <motion.h2
          className="contact__title"
          initial={reduced ? undefined : "masked"}
          whileInView={reduced ? undefined : "revealed"}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        >
          {lines.map((line, index) => (
            <span className="line" key={index}>
              <motion.span
                variants={{
                  masked: { y: "112%", filter: "blur(6px)" },
                  revealed: { y: "0%", filter: "blur(0px)" },
                }}
                transition={{ duration: 1.15, delay: index * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <div className="contact__grid">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          >
            <p className="contact__note">
              I am looking for an internship, freelance site and interface work, hackathon teams,
              and anything cloud or full-stack that needs finishing. Email is the fastest route —
              two lines about the work is enough to start.
            </p>
            <a className="contact__mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="contact__meta mono">
              <span>Jaipur, India</span>
              <span>Replies within a day</span>
            </p>
          </motion.div>

          <motion.div
            className="contact__list"
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            {social.map((item) => (
              <a
                key={item.label}
                className="contact__link"
                href={item.href}
                {...(item.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span className="mono">{item.label}</span>
                <span>{item.value}</span>
              </a>
            ))}
            <a className="contact__link" href={site.resume} download>
              <span className="mono">Resume</span>
              <span>
                PDF · A4 <Download size={12} />
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="contact__stamp"
        aria-hidden="true"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
      >
        <svg viewBox="0 0 120 120">
          <defs>
            <path
              id="contact-seal"
              d="M60,60 m46,0 a46,46 0 1,1 -92,0 a46,46 0 1,1 92,0"
              fill="none"
            />
          </defs>
          <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeOpacity="0.25" />
          <text fontSize="8.6" letterSpacing="2.1" fill="currentColor">
            <textPath href="#contact-seal" textLength="283" lengthAdjust="spacing">
              OPEN TO INTERNSHIPS · FREELANCE · COLLABS ·
            </textPath>
          </text>
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fontStyle="italic"
            fill="currentColor"
          >
            SR
          </text>
        </svg>
      </motion.div>
    </section>
  );
}
