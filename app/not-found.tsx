import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="notfound shell">
      <p className="mono" style={{ color: "var(--accent)", marginBottom: "1.5rem" }}>
        404 — Off the map
      </p>
      <h1>
        Nothing
        <br />
        <span className="italic">here</span> yet.
      </h1>
      <p className="measure" style={{ marginTop: "1.5rem", color: "var(--muted)" }}>
        The page you asked for does not exist. The work does, though.
      </p>
      <Link href="/" className="btn" style={{ marginTop: "2rem", width: "fit-content" }}>
        <ArrowLeft size={13} />
        Back to the portfolio
      </Link>
    </section>
  );
}
