import { ArrowRight } from "@/components/icons";

/**
 * Projects without reliable screenshots get a designed cover rather than
 * an empty frame. For the airport system, a boarding pass is the honest
 * visual: it is the artefact the software produces.
 */
export function Poster({ title, year }: { title: string; year: string }) {
  return (
    <div className="poster">
      <div className="poster__grid" aria-hidden="true" />

      <div className="poster__pass">
        <div className="poster__main">
          <div className="poster__top">
            <span>Boarding pass</span>
            <span>SR · {year}</span>
          </div>

          <div className="poster__codes">
            <span className="poster__code">JAI</span>
            <span className="poster__arrow" aria-hidden="true">
              <ArrowRight size={15} />
            </span>
            <span className="poster__code">AMS</span>
          </div>

          <div className="poster__sub">
            <span>{title}</span>
            <span>Seat 14A · Gate G5</span>
          </div>
        </div>

        <div className="poster__stub" aria-hidden="true">
          <span>SR · {year} · JAI</span>
          <div className="poster__bars" />
          <span>14A</span>
        </div>
      </div>
    </div>
  );
}
