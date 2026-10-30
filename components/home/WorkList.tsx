"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { projects } from "@/lib/projects";
import { ArrowUpRight } from "@/components/icons";
import { useBelt } from "@/components/motion/useBelt";

/**
 * The conveyor. Eight plates on one belt that never stops: the loop drifts
 * left, page-scroll velocity multiplies that speed and can reverse it, and
 * hovering brakes it to a crawl so a plate can be read and clicked. Clicking
 * any plate opens its full case file. The second copy of the row exists only
 * to keep the loop seamless — it is hidden from the accessibility tree and
 * unfocusable.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function WorkList() {
  const belt = useBelt({ speed: 34 });

  const plate = (item: (typeof projects)[number], index: number, copy: 0 | 1) => (
    <Link
      key={`${copy}-${item.slug}`}
      href={`/work/${item.slug}`}
      className="conv__plate"
      aria-hidden={copy ? true : undefined}
      tabIndex={copy ? -1 : undefined}
    >
      <div className="conv__media">
        {item.cover && <Image src={item.cover} alt="" fill sizes="(max-width: 700px) 78vw, 26vw" />}
      </div>
      <p className="conv__meta mono">
        <span>Exhibit {pad(index + 1)}</span>
        <span>{item.year}</span>
      </p>
      <h3 className="conv__title">
        {item.shortTitle}
        <ArrowUpRight size={16} aria-hidden="true" />
      </h3>
      <p className="conv__kind mono">{item.kind}</p>
    </Link>
  );

  return (
    <div className="conv" {...belt.handlers}>
      <motion.div ref={belt.trackRef} className="conv__track" style={belt.style}>
        {projects.map((item, index) => plate(item, index, 0))}
        {projects.map((item, index) => plate(item, index, 1))}
      </motion.div>

      <div className="conv__edge" aria-hidden="true" />

      <div className="conv__foot mono" aria-hidden="true">
        <span>Exhibits 01 — {pad(projects.length)}</span>
        <span>The belt obeys your scroll · Click a plate for its case file</span>
      </div>
    </div>
  );
}
