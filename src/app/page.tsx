import Link from "next/link";
import { ArrowIcon, Icon, type IconName } from "@/components/Icon";
import { IsoFrame } from "@/components/illustrations/IsoFrame";
import { ServiceIllustration } from "@/components/illustrations/ServiceIllustration";
import { Parallax } from "@/components/Parallax";
import { PhoneLink } from "@/components/PhoneLink";
import { QuantitiesTable } from "@/components/QuantitiesTable";
import { CtaBlock, Faq, Marquee, SectionHead } from "@/components/Sections";
import { Tabs } from "@/components/Tabs";
import { principles, processSteps } from "@/content/company";
import { commonFaq } from "@/content/faq";
import { sectors } from "@/content/sectors";
import { serviceBySlug, services } from "@/content/services";
import { site } from "@/content/site";
import s from "./home.module.css";

export const metadata = { alternates: { canonical: "/" } };

const facts = [
  { label: "Discipline", value: "Civil & structural design" },
  { label: "Scope", value: "Design only, no construction" },
  { label: "Coverage", value: "London & across England" },
  { label: "Company", value: `Reg. no. ${site.company.number}` },
];

const deliverables = [
  {
    id: "frame",
    label: "Structural drawing",
    sheet: "Structural frame elevation",
    image: { src: "/drawings/frame-elevation.svg", width: 1000, height: 640, alt: "Illustrative structural drawing: three-storey steel frame elevation on gridlines A to E with storey heights, bracing and pad foundations." },
    title: "Structural calculations and drawings",
    text: "Member sizes, positions, bearings and foundation details, drawn so your builder can work from them and building control can follow the design.",
    points: ["Design basis, loads and checks", "Beam, column and foundation details", "Issued as PDF and AutoCAD DWG"],
    href: "/services/structural-design/",
  },
  {
    id: "plan",
    label: "Floor plan",
    sheet: "Proposed ground floor plan",
    image: { src: "/drawings/rear-extension-plan.svg", width: 850, height: 628, alt: "Illustrative floor plan of a single-storey rear extension, 6.1 by 3.9 metres, with a kitchen-dining room, bi-fold doors and a roof lantern." },
    title: "Accurate, layered AutoCAD plans",
    text: "Existing and proposed plans, elevations and sections, dimensioned and organised so others can build on them, with every revision numbered.",
    points: ["Plans, elevations and sections", "Sketch and PDF to CAD", "Numbered revisions"],
    href: "/services/autocad-plans/",
  },
  {
    id: "quantities",
    label: "Quantities",
    sheet: "Measured quantities",
    table: true,
    title: "Quantities you can check",
    text: "Every estimate shows what was measured and how, grouped by building element, with assumptions and exclusions written down.",
    points: ["Measured from the drawings", "Labour and materials shown separately", "Assumptions in writing"],
    href: "/services/quantity-surveying/",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.company.legalName,
  url: site.url,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phoneLink,
  areaServed: site.serviceAreaShort,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Suite 10 Beaufort Court, Admirals Way",
    addressLocality: "London",
    postalCode: "E14 9XL",
    addressCountry: "GB",
  },
  ...(site.social.length ? { sameAs: site.social.map((x) => x.url) } : {}),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero ---------------------------------------------------------- */}
      <section className={`dark ${s.hero}`} aria-labelledby="hero-title">
        <div className={s.heroGrid} aria-hidden="true" />
        <div className={s.heroGlow} aria-hidden="true" />
        <div className={`container ${s.heroInner}`}>
          <div className={s.heroText}>
            <p className="eyebrow">Civil engineering design consultancy · London</p>
            <h1 id="hero-title" className={s.heroTitle}>
              Structural design and drawings <span>you can build from.</span>
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Structural design, AutoCAD plans and quantity surveying for homeowners, property developers, house builders
              and engineering firms across England.
            </p>
            <div className="btn-row">
              <Link href="/request-a-quote/" className="btn btn--light">
                Request a quote
                <ArrowIcon />
              </Link>
              <PhoneLink className="btn btn--ghost-dark" label={`Call ${site.contact.phoneDisplay}`} />
            </div>
            <p className={s.credential}>
              <span className={s.badge}>{site.founder.membershipShort}</span>
              Led by a Graduate Member of the Institution of Civil Engineers
            </p>
          </div>
          <Parallax className={s.heroArt}>
            <IsoFrame />
          </Parallax>
        </div>
        <div className="container">
          <dl className={s.facts}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Marquee />

      {/* Services ------------------------------------------------------ */}
      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHead
            index="01"
            label="Services"
            id="services-title"
            title="Three disciplines. One accountable engineer."
            text="Design and consultancy only. We prepare the calculations, drawings and cost information; your builder carries out the work."
            split
          />
          <div className={s.bento}>
            {services.map((service, i) => (
              <article key={service.slug} className={`${s.serviceCard} ${i === 0 ? `dark ${s.featured}` : ""}`} data-reveal>
                <div className={s.cardTop}>
                  <span className={s.cardIndex}>{service.index}</span>
                  <Icon name="arrow-up-right" className={s.cardArrow} />
                </div>
                <h3>
                  <Link href={`/services/${service.slug}/`} className={s.cardLink}>{service.name}</Link>
                </h3>
                <p className={s.cardText}>{service.summary}</p>
                <ul className={s.chips}>
                  {service.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <ServiceIllustration name={service.illustration} className={s.cardArt} />
              </article>
            ))}
            <div className={s.bentoCta} data-reveal>
              <div>
                <h3>Not sure which service you need?</h3>
                <p>Describe the project and we will tell you exactly what it needs, and what it does not.</p>
              </div>
              <Link href="/request-a-quote/" className="btn btn--primary">
                Describe your project
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables ------------------------------------------------- */}
      <section className="section paper-2" aria-labelledby="receive-title">
        <div className="container">
          <SectionHead
            index="02"
            label="What you receive"
            id="receive-title"
            title="Documents built to be built from."
            text="Every package is drawn and set out so builders, building control and other professionals can follow it. These are illustrative samples, not client projects."
            split
          />
          <div data-reveal>
            <Tabs
              label="Sample deliverables"
              variant="pills"
              items={deliverables.map((d, i) => ({
                id: d.id,
                label: d.label,
                content: (
                  <div className={s.viewer}>
                    <figure className={s.sheet}>
                      <figcaption className={s.sheetBar}>
                        <span>Sheet 0{i + 1}</span>
                        <span className={s.sheetName}>{d.sheet}</span>
                        <span className={s.sample}>Illustrative sample</span>
                      </figcaption>
                      <div className={s.sheetBody}>
                        {d.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={d.image.src} width={d.image.width} height={d.image.height} alt={d.image.alt} loading="lazy" decoding="async" />
                        ) : (
                          <QuantitiesTable />
                        )}
                      </div>
                    </figure>
                    <div className={s.viewerNotes}>
                      <h3>{d.title}</h3>
                      <p>{d.text}</p>
                      <ul className={s.checks}>
                        {d.points.map((p) => (
                          <li key={p}><Icon name="check" />{p}</li>
                        ))}
                      </ul>
                      <Link href={d.href} className="link-arrow">
                        More about this service <Icon name="arrow-right" />
                      </Link>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Process ------------------------------------------------------- */}
      <section className="section dark" aria-labelledby="process-title">
        <div className="container">
          <SectionHead
            index="03"
            label="Process"
            id="process-title"
            title="From first call to final drawings."
            text="A written quote before any work starts, and you deal with the same engineer throughout."
            split
          />
          <ol className={s.steps}>
            {processSteps.map((step, i) => (
              <li key={step.title} data-reveal>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sectors ------------------------------------------------------- */}
      <section className="section" aria-labelledby="sectors-title">
        <div className="container">
          <SectionHead
            index="04"
            label="Who we work with"
            id="sectors-title"
            title="Built around who you are."
            text="Small and medium-sized projects, for clients who need dependable design information before work starts on site. Choose the option that describes you."
            split
          />
          <div data-reveal>
            <Tabs
              label="Who are you?"
              items={sectors.map((sector) => ({
                id: sector.key,
                label: sector.tab,
                content: (
                  <div className={s.sectorPanel}>
                    <h3>{sector.name}</h3>
                    <p className="lead">{sector.summary}</p>
                    <p>{sector.detail}</p>
                    <ul className={s.chipsLink} aria-label="Relevant services">
                      {sector.services.map((slug) => {
                        const svc = serviceBySlug(slug)!;
                        return (
                          <li key={slug}>
                            <Link href={`/services/${slug}/`}>{svc.name}<Icon name="arrow-up-right" /></Link>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="btn-row">
                      <Link href="/request-a-quote/" className="btn btn--primary">
                        Request a quote
                        <ArrowIcon />
                      </Link>
                      <Link href={`/sectors/#${sector.key}`} className="link-arrow">
                        Working with {sector.short} <Icon name="arrow-right" />
                      </Link>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Principles ---------------------------------------------------- */}
      <section className="section paper-2" aria-labelledby="why-title">
        <div className="container">
          <SectionHead index="05" label="Why Whitestone" id="why-title" title="What working with us is like." />
          <ul className={s.principles}>
            {principles.map((p) => (
              <li key={p.title} data-reveal>
                <span className={s.principleIcon}><Icon name={p.icon as IconName} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engineer ------------------------------------------------------ */}
      <section className="section dark" aria-labelledby="engineer-title">
        <div className={`container ${s.engineer}`}>
          <div data-reveal>
            <p className="eyebrow">06 — The engineer</p>
            <h2 id="engineer-title" className={s.statement}>
              You deal directly with the engineer <span>doing the work.</span>
            </h2>
          </div>
          <div className={s.profile} data-reveal>
            <div className={s.profileHead}>
              <span className={s.avatar} aria-hidden="true">{site.founder.initials}</span>
              <div>
                <p className={s.profileName}>{site.founder.name}</p>
                <p className={s.profileRole}>{site.founder.role}</p>
              </div>
            </div>
            <dl className={s.profileFacts}>
              <div><dt>Membership</dt><dd>{site.founder.membership}</dd></div>
              <div><dt>Company</dt><dd>{site.company.legalName}</dd></div>
              <div><dt>Registered</dt><dd>{site.company.registeredIn}, no. {site.company.number}</dd></div>
              <div><dt>Founded</dt><dd>{site.company.foundedMonth}</dd></div>
            </dl>
            <Link href="/about/" className="link-arrow">
              About Whitestone <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ ----------------------------------------------------------- */}
      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${s.faqLayout}`}>
          <div className={s.faqHead}>
            <SectionHead index="07" label="Questions" id="faq-title" title="Straight answers." text="What clients usually ask before getting in touch." />
            <Link href="/services/#questions" className="link-arrow">
              All questions and answers <Icon name="arrow-right" />
            </Link>
          </div>
          <Faq items={commonFaq} />
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
