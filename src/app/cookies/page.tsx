import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { analyticsName, analyticsSrc, links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Cookie information",
  description: "How the Whitestone Civil Engineering website uses cookies and similar technologies.",
  alternates: { canonical: "/cookies/" },
};

export default function CookiesPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Cookie information" }]} title="Cookie information." lead="How this website uses cookies and similar technologies." />
      <section className="section">
        <div className={`container ${p.prose}`}>
          <h2>Cookies</h2>
          <p>
            This website does not use cookies for advertising or tracking, and its own code does not store information on your
            device. <Tbc>Confirm whether the hosting provider sets any strictly necessary cookies, for example for security</Tbc>
          </p>

          <h2>Website statistics</h2>
          {analyticsSrc ? (
            <p>
              We use {analyticsName}, a privacy-focused statistics service that counts visits and pages viewed without using
              cookies and without identifying you. We use these figures only to improve the website.
            </p>
          ) : (
            <p>We do not currently collect website statistics.</p>
          )}

          <h2>Links to other services</h2>
          <p>
            Links to WhatsApp, Google Maps and other websites take you to services that have their own cookie and privacy
            policies. Nothing from those services is loaded on this website until you follow a link.
          </p>

          <h2>Questions</h2>
          <p>
            Email <a href={links.email}>{site.contact.email}</a>. Our <Link href="/privacy/">privacy notice</Link> explains how we
            use personal information.
          </p>
        </div>
      </section>
    </>
  );
}
