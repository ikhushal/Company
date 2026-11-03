import Link from "next/link";
import { services } from "@/content/services";
import { endpoints, isProduction, links, site } from "@/content/site";
import { ArrowIcon, Icon } from "./Icon";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { PhoneLink } from "./PhoneLink";
import styles from "./Footer.module.css";

export function Footer() {
  const { company, contact } = site;
  return (
    <footer className={`dark ${styles.footer}`}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo tone="light" />
            <p>Civil engineering design consultancy. Structural design, AutoCAD plans and quantity surveying across England.</p>
            {endpoints.newsletter ? (
              <NewsletterForm endpoint={endpoints.newsletter} />
            ) : !isProduction ? (
              <p className="dev-note">
                Preview: newsletter sign-up appears here once a mailing service is set in{" "}
                <code>NEXT_PUBLIC_NEWSLETTER_ENDPOINT</code>.
              </p>
            ) : null}
          </div>

          <nav aria-labelledby="footer-services" className={styles.col}>
            <h2 id="footer-services" className={styles.heading}>Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}/`}>{s.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/request-a-quote/">Request a quote</Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-company" className={styles.col}>
            <h2 id="footer-company" className={styles.heading}>Company</h2>
            <ul>
              <li><Link href="/about/">About</Link></li>
              <li><Link href="/sectors/">Sectors</Link></li>
              <li><Link href="/projects/">Projects</Link></li>
              <li><Link href="/careers/">Careers</Link></li>
              <li><Link href="/contact/">Contact</Link></li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h2 className={styles.heading}>Contact</h2>
            <ul className={styles.contact}>
              <li>
                <PhoneLink />
              </li>
              <li>
                <a href={links.whatsapp} rel="noopener"><Icon name="whatsapp" />WhatsApp</a>
              </li>
              <li>
                <a href={links.email}><Icon name="mail" />{contact.email}</a>
              </li>
            </ul>
            {site.social.length > 0 && (
              <ul className={styles.social}>
                {site.social.map((s) => (
                  <li key={s.url}><a href={s.url} rel="noopener">{s.name}</a></li>
                ))}
              </ul>
            )}
            <Link href="/request-a-quote/" className={`btn btn--light btn--sm ${styles.quote}`}>
              Request a quote
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className={styles.legal}>
          <p>
            {company.legalName} is a private limited company registered in {company.registeredIn}, company number{" "}
            {company.number}. Registered office: {company.registeredOffice}.
            {company.vatNumber ? ` VAT registration number ${company.vatNumber}.` : ""}
          </p>
          <ul>
            <li><Link href="/privacy/">Privacy notice</Link></li>
            <li><Link href="/cookies/">Cookie information</Link></li>
            <li><Link href="/accessibility/">Accessibility</Link></li>
          </ul>
          <p className={styles.copy}>© {new Date().getFullYear()} {company.legalName}</p>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        Whitestone
      </div>
    </footer>
  );
}
