import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowUp } from "@/components/icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner mono">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Designed &amp; built from scratch · Jaipur, IN</span>
        <Link href="/#top" className="footer__top">
          Back to top
          <ArrowUp size={13} />
        </Link>
      </div>
    </footer>
  );
}
