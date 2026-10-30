"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const NAV_OFFSET = -72;

/**
 * Momentum scrolling. Wheel and touch input are smoothed through a single
 * RAF loop instead of CSS scroll-behaviour, which keeps scroll-linked
 * animations (progress bar, parallax) in sync with the eased position.
 *
 * Disabled entirely for reduced-motion users, where native scrolling is
 * already the correct behaviour.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onLock = () => lenis.stop();
    const onUnlock = () => lenis.start();
    window.addEventListener("sr:lock", onLock);
    window.addEventListener("sr:unlock", onUnlock);

    // Intercept same-page hash links so they ease to the target with the
    // fixed header offset instead of jumping.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;

      const anchor = (event.target as Element | null)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.35 });
      history.replaceState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("sr:lock", onLock);
      window.removeEventListener("sr:unlock", onUnlock);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const hash = window.location.hash;
    if (hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.1 });
      }, 140);
      return () => window.clearTimeout(timer);
    }

    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
