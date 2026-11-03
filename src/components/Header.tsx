"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { links, nav, site } from "@/content/site";
import { ArrowIcon, Icon } from "./Icon";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const solid = scrolled && !open;

  return (
    <header className={`${styles.header} ${solid ? styles.solid : ""} ${open ? styles.open : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Logo tone={solid ? "dark" : "light"} />

        <nav className={styles.nav} aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.phone} href={links.tel}>
            <Icon name="phone" />
            <span>{site.contact.phoneDisplay}</span>
          </a>
          <Link href="/request-a-quote/" className={`btn btn--sm ${solid ? "btn--primary" : "btn--light"} ${styles.cta}`}>
            Request a quote
            <ArrowIcon />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className={`dark ${styles.menu}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ol className={styles.menuList}>
            {nav.map((item, index) => (
              <li key={item.href} style={{ "--i": index } as CSSProperties}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  <span className={styles.menuIndex}>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.menuFoot}>
          <Link href="/request-a-quote/" className="btn btn--light">
            Request a quote
            <ArrowIcon />
          </Link>
          <a className="btn btn--ghost-dark" href={links.tel}>
            <Icon name="phone" />
            {site.contact.phoneDisplay}
          </a>
          <a className="btn btn--ghost-dark" href={links.whatsapp} rel="noopener">
            <Icon name="whatsapp" />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
