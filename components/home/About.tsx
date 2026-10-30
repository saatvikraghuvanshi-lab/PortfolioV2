"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal, Rule } from "@/components/motion/Reveal";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { SectionHead } from "@/components/site/SectionHead";
import { site } from "@/lib/site";

const EASE = [0.19, 1, 0.22, 1] as const;

type Position = {
  claim: string;
  note: string;
  body: string;
  /** short form used by the running index in the rail */
  short: string;
};

const positions: Position[] = [
  {
    claim: "The schema is the design.",
    note: "Airport Management System · nine tables",
    body: "The airport system is nine tables that have to agree — airlines to baggage. When the model is right, the screens are transcription; when it is wrong, no design rescues them.",
    short: "The schema is the design",
  },
  {
    claim: "A number on a screen is a claim, so I label it.",
    note: "Lunar Ice · OrbitalQuery",
    body: "Satellite work invites invented precision. I keep measured, derived and assumed values in separate registers — and where a result is not in yet, I write that instead of dressing up a placeholder.",
    short: "Every number is labelled",
  },
  {
    claim: "Reference is research. Tracing someone's interface is not.",
    note: "On copying",
    body: "I read other people's interfaces constantly, then close the tab and design from the idea. I would turn down paid work that redrew a competitor's layout — copying teaches nothing.",
    short: "Reference, not tracing",
  },
  {
    claim: "My projects die of scope I let in, not of hard problems.",
    note: "The honest failure mode",
    body: "One loop working end to end and deployed, before a second idea is allowed in. VibeBatch works for exactly this reason — the entire product is one constraint.",
    short: "Scope, not difficulty",
  },
];

const ledger = [
  { term: "Based", detail: "Jaipur, India" },
  { term: "Studying", detail: "B.Tech CSE · MUJ" },
  { term: "Graduating", detail: "2029" },
  { term: "Currently", detail: "Open to internships" },
];

export function About() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* The rail reports which claim has crossed the middle of the viewport, so the
     aside behaves like a running head in a printed book rather than a sidebar.
     Measured on scroll rather than observed, so a fast jump with Lenis or a hash
     link still lands on the right position instead of the last one to fire. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-pos]"));
    if (!items.length) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const midpoint = window.innerHeight * 0.5;
      let next = 0;
      items.forEach((item, index) => {
        if (item.getBoundingClientRect().top <= midpoint) next = index;
      });
      setActive(next);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const current = positions[active];

  return (
    <section className="section shell" id="about">
      <SectionHead
        index="02"
        label="About"
        title={
          <>
            What I actually <span className="italic accent">believe</span> about this work.
          </>
        }
        aside="Four things I would defend"
      />

      <div className="about">
        <div className="about__rail">
          <motion.figure
            className="about__plate"
            initial={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            whileInView={reduced ? undefined : { clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1.25, ease: EASE }}
          >
            <img
              src="/profile/saatvik.webp"
              alt="Portrait of Saatvik Raghuvanshi"
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>

          <Reveal delay={0.18}>
            <div className="about__plate-meta mono">
              <span>{site.name}</span>
              <span>Fig. 02</span>
            </div>

            <dl className="about__ledger">
              {ledger.map((row) => (
                <div key={row.term}>
                  <dt className="mono">{row.term}</dt>
                  <dd>{row.detail}</dd>
                </div>
              ))}
            </dl>

            <p className="about__reading mono">
              <b>{String(active + 1).padStart(2, "0")}</b>
              <i>/ 0{positions.length}</i>
              <span>{current.short}</span>
            </p>
          </Reveal>
        </div>

        <div className="about__sheet">
          <Reveal>
            <p className="about__lede">
              I am a second-year computer science student in Jaipur, and I got into this the
              ordinary way: I liked making something appear on a screen that was not there an hour
              before. Everything below is what that turned into.
            </p>
          </Reveal>

          {/* The positions are printed as a schema, not as paragraphs: every
              claim carries its index, its scope and a one-line key the rail
              above repeats while you read. The record is the design. */}
          <div className="schema" ref={listRef}>
            {positions.map((position, index) => (
              <motion.article
                key={position.claim}
                data-pos={index}
                className={`schema__row${active === index ? " is-active" : ""}`}
                initial={reduced ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -14% 0px" }}
                transition={{ duration: 0.85, ease: EASE }}
              >
                <p className="schema__rule mono">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>position</span>
                  <span>{position.short}</span>
                </p>

                <h3 className="schema__claim">{position.claim}</h3>
                <p className="schema__note mono">{position.note}</p>
                <p className="schema__body">{position.body}</p>
              </motion.article>
            ))}
          </div>

          <Reveal delay={0.05}>
            <div className="about__record">
              <div>
                <AnimatedNumber className="about__record-value" value={8} pad={2} />
                <span className="mono">Selected projects</span>
              </div>
              <div>
                <AnimatedNumber className="about__record-value" value={6} pad={2} />
                <span className="mono">Hackathons &amp; ideathons</span>
              </div>
              <div>
                <AnimatedNumber className="about__record-value" value={7} decimals={1} />
                <span className="mono">Current GPA</span>
              </div>
              <div>
                <span className="about__record-value">2029</span>
                <span className="mono">Graduating</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="about__closing">
              <p>
                I do my best work late, alone, with nothing else open — which is also why the
                corrections that stick have come from other people: the most useful one arrived
                when I was wrong out loud in a code review.
              </p>
              <p>
                I am early. Some of this is a learning build rather than a product, and each case
                study says so where it is true.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div style={{ marginTop: "clamp(2.5rem, 6vh, 4rem)" }}>
        <Rule />
      </div>
    </section>
  );
}
