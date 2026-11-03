import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Sections";
import { links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Careers at Whitestone Civil Engineering. We are not recruiting at the moment, but welcome enquiries from engineers, CAD technicians and quantity surveyors.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Careers" }]} title="Careers." lead="We are not recruiting at the moment." />
      <section className="section" aria-labelledby="future-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Future opportunities</p>
            <h2 id="future-title">Growing carefully.</h2>
          </div>
          <div className={p.body} data-reveal>
            <p>
              Whitestone Civil Engineering is a newly established practice. As it grows, we expect to work with civil and
              structural engineers, CAD technicians and quantity surveyors.
            </p>
            <p>
              If you would like to be considered for future roles or freelance work, email your CV and a short note about your
              experience to <a href={links.email}>{site.contact.email}</a>.
            </p>
            <p className={p.muted}>
              We keep your details only for as long as described in our <Link href="/privacy/">privacy notice</Link>, and do not
              share them outside the company.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
