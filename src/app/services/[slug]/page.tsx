import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ServiceIllustration } from "@/components/illustrations/ServiceIllustration";
import { CtaBlock, PageHero, SectionHead } from "@/components/Sections";
import { serviceBySlug, services } from "@/content/services";
import p from "../../pages.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}/` },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services/" }, { label: service.name }]}
        index={service.index}
        title={service.name}
        lead={service.lead}
        aside={
          <div className={p.heroArt}>
            <ServiceIllustration name={service.illustration} />
            <p className={p.heroArtLabel}>Illustrative · not a client project</p>
          </div>
        }
      />

      <section className="section" aria-labelledby="scope-title">
        <div className="container">
          <SectionHead label="Scope" id="scope-title" title={service.scope.title} text={service.scope.intro} split />
          <ul className={`${p.checks} ${p.checks2}`}>
            {service.scope.items.map((item) => (
              <li key={item} data-reveal>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section paper-2" aria-labelledby="deliverables-title">
        <div className="container">
          <SectionHead label="What you receive" id="deliverables-title" title="What you receive." text="Your quote lists exactly what is included." split />
          <div className={`${p.cards} ${p.cards3}`}>
            {service.deliverables.map((d, i) => (
              <article key={d.title} className={p.card} data-reveal>
                <span className={p.cardIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="inputs-title">
        <div className={`container ${p.sidehead}`}>
          <div data-reveal>
            <p className="eyebrow">Getting started</p>
            <h2 id="inputs-title">What we need from you.</h2>
            <p className={p.muted}>If something is missing, we tell you, or list the assumption made in its place.</p>
          </div>
          <ol className={p.numbered} data-reveal>
            {service.inputs.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="notes-title">
        <div className="container">
          <div className={p.notes} data-reveal>
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 id="notes-title">{service.notes.title}</h2>
            </div>
            <div className={p.body}>
              {service.notes.paragraphs.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="related-title">
        <div className="container">
          <h2 id="related-title" className="eyebrow" style={{ marginBottom: "1.5rem" }}>Related services</h2>
          <div className={p.related}>
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}/`} className={p.relatedCard} data-reveal>
                <div>
                  <h3>{o.name}</h3>
                  <p>{o.summary}</p>
                </div>
                <Icon name="arrow-up-right" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock title={service.cta.title} text={service.cta.text} href={`/request-a-quote/?service=${service.slug}`} />
    </>
  );
}
