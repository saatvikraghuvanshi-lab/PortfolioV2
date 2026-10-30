import type { CSSProperties } from "react";
import type { Tech } from "@/lib/tech";

function Copy({ logos, hidden }: { logos: Tech[]; hidden?: boolean }) {
  return (
    <div className="logo-band__copy" aria-hidden={hidden || undefined}>
      {logos.map((tech, index) => (
        <span
          key={`${tech.name}-${index}`}
          className="logo-band__cell"
          style={{ "--brand": tech.brand ?? "var(--cream)" } as CSSProperties}
          title={tech.name}
        >
          <i
            className="logo-band__item"
            style={{ "--logo": `url(${tech.logo})` } as CSSProperties}
          />
          <span className="logo-band__label mono">{tech.name}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Two counter-scrolling rows of brand marks. CSS-only so it costs no
 * JavaScript; hovering pauses both rows and names the mark under the cursor.
 */
export function LogoBand({ logos }: { logos: Tech[] }) {
  return (
    <div className="logo-band" role="img" aria-label="The tools I build with">
      <div className="logo-band__viewport">
        <div className="logo-band__row">
          <Copy logos={logos} />
          <Copy logos={logos} hidden />
        </div>
      </div>
      <div className="logo-band__viewport">
        <div className="logo-band__row logo-band__row--reverse">
          <Copy logos={[...logos].reverse()} />
          <Copy logos={[...logos].reverse()} hidden />
        </div>
      </div>
    </div>
  );
}
