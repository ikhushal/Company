import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/Icon";
import { CtaBlock, PageHero, SectionHead } from "@/components/Sections";
import { DevNote } from "@/components/Tbc";
import { principles, processSteps } from "@/content/company";
import { site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Whitestone Civil Engineering is a civil engineering design consultancy led by a Graduate Member of the Institution of Civil Engineers.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const { company, founder } = site;
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        title="Engineering you can hold to account."
        lead="A civil engineering design consultancy providing structural design, AutoCAD plans and quantity surveying for homeowners, developers, house builders and engineering firms."
      />

      <section className="section" aria-labelledby="who-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Who we are</p>
            <h2 id="who-title">A focused practice, by design.</h2>
          </div>
          <div className={p.body} data-reveal>
            <p className="lead" style={{ color: "var(--ink)" }}>
              Whitestone Civil Engineering was founded in {company.foundedMonth} by {founder.name}, a civil engineer and{" "}
              {founder.membership}.
            </p>
            <p>
              The practice provides design and consultancy only. We prepare the structural calculations, drawings and cost
              information that clients, builders and building control bodies work from, on small and medium-sized projects
              across England.
            </p>
            <p>
              As a focused practice, you deal directly with the engineer doing the work. There is no hand-over between a sales
              team and a design team, and questions reach the person who can answer them.
            </p>
          </div>
        </div>
      </section>

      <section className="section paper-2" aria-labelledby="engineer-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">The engineer</p>
            <h2 id="engineer-title">Who you will work with.</h2>
          </div>
          <div className={p.profile} data-reveal>
            <div className={p.profileHead}>
              <span className={p.avatar} aria-hidden="true">{founder.initials}</span>
              <div>
                <p className={p.profileName}>{founder.name}</p>
                <p className={p.muted}>{founder.role}</p>
              </div>
            </div>
            <p>{founder.membership}.</p>
            {founder.bio ? (
              <p>{founder.bio}</p>
            ) : (
              <DevNote>
                Preview: add the professional biography supplied by the client (<code>founder.bio</code> in site.json): education,
                experience and the kinds of projects worked on. Previous employers’ projects may be described as personal
                experience only.
              </DevNote>
            )}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="container">
          <SectionHead label="How we work" id="principles-title" title="Principles we hold ourselves to." split />
          <div className={`${p.cards}`} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))" }}>
            {principles.map((x) => (
              <article key={x.title} className={p.card} data-reveal>
                <span className={p.iconBox}><Icon name={x.icon as IconName} /></span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper-2" aria-labelledby="process-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Process</p>
            <h2 id="process-title">Five steps, written down.</h2>
          </div>
          <ol className={p.numbered} data-reveal>
            {processSteps.map((step) => (
              <li key={step.title}>
                <span><strong style={{ color: "var(--ink)" }}>{step.title}.</strong> {step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="details-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Company details</p>
            <h2 id="details-title">On the record.</h2>
            <p className={p.muted}>As registered at Companies House.</p>
          </div>
          <dl className={p.factTable} data-reveal>
            <div><dt>Registered name</dt><dd>{company.legalName}</dd></div>
            <div><dt>Company number</dt><dd>{company.number}</dd></div>
            <div><dt>Registered in</dt><dd>{company.registeredIn}</dd></div>
            <div><dt>Registered office</dt><dd>{company.registeredOffice}</dd></div>
            <div><dt>Incorporated</dt><dd>{company.incorporated}</dd></div>
            <div><dt>Membership</dt><dd>{founder.membership}</dd></div>
          </dl>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
