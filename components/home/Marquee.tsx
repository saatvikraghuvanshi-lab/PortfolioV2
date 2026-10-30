const items = [
  "Full-stack product",
  "Geospatial interfaces",
  "Interface design",
  "Satellite data",
  "AI-assisted tools",
  "Relational data",
  "Motion & interaction",
  "Ship, then refine",
];

export function Marquee() {
  const track = (
    <div className="marquee__track" aria-hidden="true">
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <b>✳</b>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-label="Areas of practice">
      {track}
      {track}
    </div>
  );
}
