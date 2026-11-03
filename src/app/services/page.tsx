import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ServiceIllustration } from "@/components/illustrations/ServiceIllustration";
import { CtaBlock, Faq, PageHero, SectionHead } from "@/components/Sections";
import { allFaq } from "@/content/faq";
import { services } from "@/content/services";
import p from "../pages.module.css";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Structural design, AutoCAD plans and quantity surveying from a civil engineering design consultancy. Find the right service for your project.",
  alternates: { canonical: "/services/" },
};

const matcher = [
  { need: "You are removing a wall, extending or converting a loft and need beams, foundations or calculations for building control", go: ["structural-design"] },
  { need: "You need plans, elevations or sections drawn, or existing drawings converted to AutoCAD", go: ["autocad-plans"] },
  { need: "You want to know what a project is likely to cost, or need quantities for tendering or ordering", go: ["quantity-surveying"] },
  { need: "You are a developer testing whether a scheme works structurally and financially", go: ["structural-design", "quantity-surveying"] },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services" }]}
        title="Design, drawings and cost, under one roof."
        lead="Structural design, AutoCAD plans and quantity surveying. Each can be commissioned on its own; together they give you drawings, calculations and costs that agree with each other."
      />

      <section className="section" aria-label="All services">
        <div className="container">
          <div className={s.list}>
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}/`} className={s.row} data-reveal>
                <span className={s.index}>{service.index}</span>
                <div className={s.rowText}>
                  <h2>{service.name}</h2>
                  <p>{service.summary}</p>
                  <ul className={s.chips}>
                    {service.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
                <ServiceIllustration name={service.illustration} className={s.art} />
                <span className={s.go} aria-hidden="true"><Icon name="arrow-up-right" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper-2" aria-labelledby="which-title">
        <div className="container">
          <SectionHead label="Which service?" id="which-title" title="Find the right starting point." text="Not sure? Describe the project when you request a quote and we will tell you." split />
          <ul className={s.matcher}>
            {matcher.map((m) => (
              <li key={m.need} data-reveal>
                <p>{m.need}</p>
                <span className={s.arrow} aria-hidden="true"><Icon name="arrow-right" /></span>
                <span className={s.targets}>
                  {m.go.map((slug) => {
                    const svc = services.find((x) => x.slug === slug)!;
                    return <Link key={slug} href={`/services/${slug}/`}>{svc.name}</Link>;
                  })}
                </span>
              </li>
            ))}
            <li data-reveal>
              <p>You are an engineering firm that needs extra drafting or design capacity</p>
              <span className={s.arrow} aria-hidden="true"><Icon name="arrow-right" /></span>
              <span className={s.targets}><Link href="/sectors/#consultancies">Subcontract support</Link></span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="scope-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Scope</p>
            <h2 id="scope-title">Design and consultancy only.</h2>
          </div>
          <div className={p.body} data-reveal>
            <p>
              Whitestone Civil Engineering does not carry out construction work. We prepare the structural calculations,
              drawings and cost information that your builder, contractor and building control body work from.
            </p>
            <p>
              Some projects also need input from other specialists, such as a party wall surveyor, a planning consultant or
              a geotechnical engineer. Where that applies, we tell you early, so it is in your budget and your timescale from
              the start.
            </p>
          </div>
        </div>
      </section>

      <section className="section paper-2" id="questions" aria-labelledby="questions-title">
        <div className={`container ${p.sidehead}`}>
          <div>
            <SectionHead label="Questions" id="questions-title" title="Questions and answers." />
          </div>
          <Faq items={allFaq} />
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
