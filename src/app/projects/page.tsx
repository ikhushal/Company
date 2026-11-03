import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBlock, PageHero } from "@/components/Sections";
import { DevNote } from "@/components/Tbc";
import { site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Structural design, AutoCAD drawing and quantity surveying projects from Whitestone Civil Engineering, described with the client’s permission.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const published = site.projects.filter((x) => x.permission);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Projects" }]}
        title="Projects."
        lead="Examples of our structural design, AutoCAD drawing and quantity surveying work. Every project is described with the client’s permission."
      />
      <section className="section" aria-labelledby="projects-title">
        <div className="container">
          <h2 id="projects-title" className="visually-hidden">Project list</h2>
          {published.length > 0 ? (
            <div className={p.projectGrid}>
              {published.map((project) => (
                <article key={project.title} className={`${p.card} ${p.projectCard}`} data-reveal>
                  <span className={p.cardIndex}>
                    {project.context === "previous-role" ? "Project experience from a previous role" : "Whitestone Civil Engineering project"}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <dl>
                    <dt>Location</dt><dd>{project.location}</dd>
                    <dt>Work</dt><dd>{project.type}</dd>
                    <dt>Our role</dt><dd>{project.role}</dd>
                    {project.completed && (<><dt>Completed</dt><dd>{project.completed}</dd></>)}
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="flow" style={{ ["--flow" as string]: "1.5rem" }}>
              <div className={p.empty} data-reveal>
                <span className={p.emptyBadge}>In preparation</span>
                <h2>Case studies are on their way.</h2>
                <p className={p.muted}>
                  Whitestone Civil Engineering was established in {site.company.foundedMonth}. Case studies will appear here as
                  projects are completed and clients agree to them being published.
                </p>
                <p className={p.muted}>In the meantime, each service page shows illustrative examples of the drawings and documents we produce.</p>
                <div className="btn-row">
                  <Link href="/services/" className="btn btn--primary">
                    View services <Icon name="arrow-right" className="btn__arrow" />
                  </Link>
                  <Link href="/request-a-quote/" className="btn btn--ghost">Request a quote</Link>
                </div>
              </div>
              <DevNote>
                Preview: add projects to <code>projects</code> in <code>src/content/site.json</code> with title, location, type,
                role, description, completed, context (“company” or “previous-role”) and permission (true only once the client has
                agreed). Work from a previous employer must be labelled as personal experience, never as a Whitestone contract.
              </DevNote>
            </div>
          )}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
