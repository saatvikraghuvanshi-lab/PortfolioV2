import { SectionHead } from "@/components/site/SectionHead";
import { LogoBand } from "./LogoBand";
import { SkillBoard } from "./SkillBoard";
import { bandLogos, techCount, techGroups } from "@/lib/tech";

export function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="shell">
        <SectionHead
          index="05"
          label="Capabilities"
          title={
            <>
              The stack I reach for, and <span className="italic accent">why</span>.
            </>
          }
          aside={`${techCount} tools · chosen per problem, not per trend`}
        />
      </div>

      <LogoBand logos={bandLogos} />

      <div className="shell">
        <SkillBoard groups={techGroups} />
      </div>
    </section>
  );
}
