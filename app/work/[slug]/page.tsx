import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { Gallery } from "@/components/case/Gallery";
import { Poster } from "@/components/case/Poster";
import { ParallaxCover } from "@/components/case/ParallaxCover";
import { PageFade } from "@/components/case/PageFade";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = nextProject(slug);
  const stackSummary = project.stack.slice(0, 3).join(", ");

  return (
    <PageFade>
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            dateCreated: project.year,
            author: { "@type": "Person", name: site.name, url: site.url },
            url: project.live ?? `${site.url}/work/${project.slug}/`,
            keywords: project.stack.join(", "),
          }),
        }}
      />

      <div className="shell">
        <Link href="/#work" className="case__back mono">
          <ArrowLeft size={13} />
          All projects
        </Link>
      </div>

      <header className="shell case__hero">
        <div className="case__kicker mono">
          <b>{project.kind}</b>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </div>

        <h1 className="case__title">{project.title}</h1>
        <p className="case__tagline">{project.tagline}</p>

        <div className="case__links">
          {project.live && (
            <a className="btn btn--solid" href={project.live} target="_blank" rel="noreferrer">
              Live site
              <ArrowUpRight size={13} />
            </a>
          )}
          {project.repo && (
            <a className="btn" href={project.repo} target="_blank" rel="noreferrer">
              Source code
              <ArrowUpRight size={13} />
            </a>
          )}
          {project.report && (
            <a className="btn" href={project.report} target="_blank" rel="noreferrer">
              Report (PDF)
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>

        <dl className="case__meta">
          <div>
            <dt className="mono">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="mono">Discipline</dt>
            <dd>{project.kind}</dd>
          </div>
          <div>
            <dt className="mono">My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="mono">Built with</dt>
            <dd>
              {stackSummary}
              {project.stack.length > 3 ? ` +${project.stack.length - 3}` : ""}
            </dd>
          </div>
        </dl>
      </header>

      <div className="shell">
        {project.cover ? (
          <ParallaxCover src={project.cover} alt={`${project.title} — interface`} />
        ) : (
          <figure className="case__cover">
            <Poster title={project.title} year={project.year} />
          </figure>
        )}
      </div>

      <div className="shell case__body">
        <aside className="case__side">
          <div>
            <h2>Stack</h2>
            <ul className="chips">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Links</h2>
            <ul className="chips" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              {project.live && (
                <li>
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live site ↗
                  </a>
                </li>
              )}
              {project.repo && (
                <li>
                  <a href={project.repo} target="_blank" rel="noreferrer">
                    Repository ↗
                  </a>
                </li>
              )}
              {project.report && (
                <li>
                  <a href={project.report} target="_blank" rel="noreferrer">
                    Analysis report (PDF) ↗
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2>Index</h2>
            <p className="mono" style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              {projects.findIndex((item) => item.slug === project.slug) + 1} of {projects.length}
            </p>
          </div>
        </aside>

        <div className="prose">
          {project.context && (
            <p className="case__context">
              <span aria-hidden="true">↳</span>
              <span>{project.context}</span>
            </p>
          )}

          <Reveal>
            {project.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>

          <section className="case__section">
            <Reveal>
              <h2>What I built</h2>
            </Reveal>
            <Reveal>
              <ul className="highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight.slice(0, 20)}>{highlight}</li>
                ))}
              </ul>
            </Reveal>
          </section>

          {project.gallery.length > 0 && (
            <section className="case__section">
              <Reveal>
                <h2>
                  Screens <span className="muted mono">({project.gallery.length})</span>
                </h2>
              </Reveal>
              <Gallery shots={project.gallery} />
            </section>
          )}


        </div>
      </div>

      <div className="shell">
        <Link className="next" href={`/work/${next.slug}`}>
          <div>
            <p className="next__label mono">Next project</p>
            <p className="next__title">{next.title}</p>
          </div>
          <span className="next__arrow" aria-hidden="true">
            <ArrowRight size={30} />
          </span>
        </Link>
      </div>
    </article>
    </PageFade>
  );
}
