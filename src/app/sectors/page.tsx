import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBlock, PageHero } from "@/components/Sections";
import { sectors } from "@/content/sectors";
import { serviceBySlug } from "@/content/services";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Who we work with: homeowners, property developers and house builders, and engineering consultancies needing design, drafting or cost support.",
  alternates: { canonical: "/sectors/" },
};

export default function SectorsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Sectors" }]}
        title="Who we work with."
        lead="Homeowners, property developers and house builders, and other engineering firms, on small and medium-sized projects across England."
      />
      <section className="section" aria-label="Sectors">
        <div className="container">
          {sectors.map((sector, i) => (
            <article key={sector.key} id={sector.key} className={p.sector} aria-labelledby={`${sector.key}-title`} data-reveal>
              <div>
                <p className={p.sectorIndex} aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${sector.key}-title`}>{sector.name}</h2>
              </div>
              <div className={p.body}>
                <p>{sector.summary}</p>
                <p>{sector.detail}</p>
                <h3 className="eyebrow" style={{ marginTop: "2rem" }}>Relevant services</h3>
                <ul className={p.tags}>
                  {sector.services.map((slug) => (
                    <li key={slug}>
                      <Link href={`/services/${slug}/`}>{serviceBySlug(slug)!.name}<Icon name="arrow-up-right" /></Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
