import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { WorkList } from "@/components/home/WorkList";
import { About } from "@/components/home/About";
import { Background } from "@/components/home/Background";
import { Skills } from "@/components/home/Skills";
import { Archive } from "@/components/home/Archive";
import { Contact } from "@/components/home/Contact";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { Intro } from "@/components/motion/Intro";

export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <Marquee />

      <section className="section shell" id="work">
        <SectionHead
          index="01"
          label="Exhibits"
          title={
            <>
              Eight builds. None of them <span className="italic accent">stills</span>.
            </>
          }
          aside="One belt, always in motion · Click a plate → case file"
        />

        <Reveal>
          <WorkList />
        </Reveal>
      </section>

      <About />
      <Background />
      <Skills />
      <Archive />

      <Contact />
    </>
  );
}
