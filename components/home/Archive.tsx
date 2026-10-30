import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { archive } from "@/lib/projects";
import { ArrowUpRight } from "@/components/icons";

export function Archive() {
  return (
    <div className="band band--deep">
      <section className="section section--tight shell" id="archive">
        <SectionHead
          index="06"
          label="Archive"
          title="Also built."
          aside="Repositories & live demos"
        />

        <Reveal>
          <div className="archive">
            {archive.map((item) => (
              <a
                key={item.title}
                className="archive__item"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <h3>
                  {item.title}
                  <ArrowUpRight size={15} />
                </h3>
                <p>{item.note}</p>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
