import Link from "next/link";
import type { ReactNode } from "react";
import { disciplines } from "@/content/services";
import type { FaqItem } from "@/content/faq";
import { links, site } from "@/content/site";
import { ArrowIcon, Icon } from "./Icon";
import { IsoFrame } from "./illustrations/IsoFrame";
import styles from "./Sections.module.css";

/* Inner page hero ------------------------------------------------------- */

export function PageHero({
  crumbs,
  title,
  lead,
  aside,
  index,
}: {
  crumbs: { label: string; href?: string }[];
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  index?: string;
}) {
  return (
    <section className={`dark ${styles.pageHero}`}>
      <div className={styles.grid} aria-hidden="true" />
      {!aside && (
        <div className={styles.decor} aria-hidden="true">
          <IsoFrame />
        </div>
      )}
      <div className={`container ${styles.pageHeroInner} ${aside ? styles.withAside : ""}`}>
        <div className={styles.pageHeroText}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <ol>
              <li><Link href="/">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.label}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          {index && <p className={styles.heroIndex}>{index}</p>}
          <h1>{title}</h1>
          {lead && <p className={`lead ${styles.heroLead}`}>{lead}</p>}
        </div>
        {aside && <div className={styles.pageHeroAside}>{aside}</div>}
      </div>
    </section>
  );
}

/* Disciplines marquee --------------------------------------------------- */

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className={styles.marqueeRow} aria-hidden={hidden || undefined}>
      {disciplines.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  );
  return (
    <div className={`dark ${styles.marquee}`}>
      <p className="visually-hidden">Work includes: {disciplines.join(", ")}.</p>
      <div className={styles.marqueeTrack} aria-hidden="true">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}

/* Section heading ------------------------------------------------------- */

export function SectionHead({
  index,
  label,
  title,
  text,
  split = false,
  id,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  text?: ReactNode;
  split?: boolean;
  id?: string;
}) {
  return (
    <div className={`section-head ${split ? "section-head--split" : ""}`} data-reveal>
      <div className="flow" style={{ ["--flow" as string]: "1.25rem" }}>
        <p className="eyebrow">{index ? `${index} — ${label}` : label}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

/* FAQ ------------------------------------------------------------------- */

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item, i) => (
        <details key={item.q} className={styles.faqItem} data-reveal>
          <summary>
            <span className={styles.faqNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.faqQ}>{item.q}</span>
            <span className={styles.faqIcon} aria-hidden="true"><Icon name="plus" /></span>
          </summary>
          <div className={`flow ${styles.faqA}`}>{item.a}</div>
        </details>
      ))}
    </div>
  );
}

/* Closing call to action ------------------------------------------------ */

export function CtaBlock({
  title = "Have a project in mind?",
  text = "Send a short description and any drawings you have, and we will come back to you with a written quote. Or call or WhatsApp to talk it through.",
  href = "/request-a-quote/",
  label = "Request a quote",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className={`section ${styles.ctaWrap}`} aria-labelledby="cta-title">
      <div className="container">
        <div className={`dark ${styles.cta}`} data-reveal>
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.ctaBody}>
            <p className="eyebrow">Next step</p>
            <h2 id="cta-title" className={styles.ctaTitle}>{title}</h2>
            <p className={`lead ${styles.ctaText}`}>{text}</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href={href} className="btn btn--light">
              {label}
              <ArrowIcon />
            </Link>
            <a href={links.whatsapp} className="btn btn--ghost-dark" rel="noopener">
              <Icon name="whatsapp" />
              WhatsApp
            </a>
            <a href={links.tel} className="btn btn--ghost-dark">
              <Icon name="phone" />
              {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Contact options ------------------------------------------------------- */

export function ContactOptions({ includeOffice = false }: { includeOffice?: boolean }) {
  const { contact, company } = site;
  const items = [
    { icon: "phone" as const, label: "Call", value: contact.phoneDisplay, href: links.tel },
    { icon: "whatsapp" as const, label: "WhatsApp", value: `Message ${contact.phoneDisplay}`, href: links.whatsapp, external: true },
    { icon: "mail" as const, label: "Email", value: contact.email, href: links.email },
    ...(includeOffice
      ? [{ icon: "pin" as const, label: "Registered office · view on map", value: company.registeredOffice, href: links.map, external: true }]
      : []),
  ];
  return (
    <ul className={styles.options}>
      {items.map((item) => (
        <li key={item.label}>
          <a className={styles.option} href={item.href} rel={item.external ? "noopener" : undefined}>
            <span className={styles.optionIcon}><Icon name={item.icon} /></span>
            <span className={styles.optionText}>
              <span className={styles.optionLabel}>{item.label}</span>
              <span className={styles.optionValue}>{item.value}</span>
            </span>
            <Icon name="arrow-up-right" className={styles.optionArrow} />
          </a>
        </li>
      ))}
    </ul>
  );
}
