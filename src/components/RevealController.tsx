"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades [data-reveal] elements in as they scroll into view.
 *
 * Without JavaScript, or with reduced motion, nothing is ever hidden: the
 * hiding rule only applies once this adds .reveal-ready to <html>. Elements
 * already on screen are marked visible first, so nothing flickers. Uses a
 * throttled scroll check rather than IntersectionObserver, which proved
 * unreliable in automated testing.
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-init])"));
    if (!all.length) return;

    const trigger = () => window.innerHeight * 0.9;
    let pending: HTMLElement[] = [];

    all.forEach((el) => {
      el.setAttribute("data-reveal-init", "");
      if (el.getBoundingClientRect().top < trigger()) {
        el.classList.add("is-visible");
        return;
      }
      // Stagger siblings, such as cards in a row, by up to 320ms.
      const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.hasAttribute("data-reveal"));
      el.style.setProperty("--reveal-delay", `${Math.min(Math.max(siblings.indexOf(el), 0), 4) * 80}ms`);
      pending.push(el);
    });

    root.classList.add("reveal-ready");

    let last = 0;
    let trailing: number | undefined;
    const check = () => {
      last = Date.now();
      const limit = trigger();
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
      if (!pending.length) cleanup();
    };
    const onScroll = () => {
      window.clearTimeout(trailing);
      if (Date.now() - last > 100) check();
      trailing = window.setTimeout(check, 120);
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(trailing);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
    return cleanup;
  }, [pathname]);

  return null;
}
