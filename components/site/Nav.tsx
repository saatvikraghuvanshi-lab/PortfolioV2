"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { lockScroll } from "@/lib/scroll-lock";
import { ArrowUpRight, Close, Download } from "@/components/icons";

const links = [
  { href: "/#work", label: "Work", index: "01" },
  { href: "/#about", label: "About", index: "02" },
  { href: "/#timeline", label: "Background", index: "03" },
  { href: "/#contact", label: "Contact", index: "04" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const current = window.scrollY;
      setScrolled(current > 24);

      const delta = current - last;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && current > 300);
        last = current;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const release = lockScroll();
    window.addEventListener("keydown", onKey);
    return () => {
      release();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const homePrefix = pathname === "/" ? "" : "/";

  return (
    <>
      <header className="nav" data-scrolled={scrolled} data-hidden={hidden && !open}>
        <div className="shell nav__inner">
          <Link href="/" className="brand" aria-label={`${site.name} — home`}>
            <span className="brand__mark" aria-hidden="true">
              SR
            </span>
            <span className="brand__name">
              Saatvik <span>Raghuvanshi</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {links.map((link) => (
              <Link key={link.href} href={homePrefix + link.href.replace("/", "")} className="nav__link">
                {link.label}
              </Link>
            ))}
            <a className="nav__cta" href={site.resume} download>
              Resume
              <Download />
            </a>
          </nav>

          <button
            type="button"
            className="nav__burger"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <button type="button" className="menu__close" onClick={() => setOpen(false)}>
              Close
              <Close />
            </button>

            <nav className="menu__list" aria-label="Mobile">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 34, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + index * 0.06, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                >
                  <Link
                    href={homePrefix + link.href.replace("/", "")}
                    className="menu__link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mono mono--sm">{link.index}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="menu__foot mono">
              <a href={site.resume} download>
                Download resume ↗
              </a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={12} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
