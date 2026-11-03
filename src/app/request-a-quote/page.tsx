import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactOptions, PageHero } from "@/components/Sections";
import { DevNote } from "@/components/Tbc";
import { endpoints, isProduction, links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quote for structural design, AutoCAD plans or quantity surveying. Describe your project and attach any drawings you have.",
  alternates: { canonical: "/request-a-quote/" },
};

export default function QuotePage() {
  const showForm = Boolean(endpoints.enquiry) || !isProduction;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Request a quote" }]}
        title="Request a quote."
        lead="Tell us about your project and attach any drawings you have. We will reply with questions or a written quote setting out the scope, fee and timescale."
      />
      <section className="section" aria-label="Quote request">
        <div className={`container ${p.formLayout}`}>
          <div className="flow" style={{ ["--flow" as string]: "1.5rem" }}>
            {!endpoints.enquiry && (
              <DevNote>
                Preview: this form is not connected yet, so nothing will be sent. Set <code>NEXT_PUBLIC_ENQUIRY_ENDPOINT</code>.
                Without it, the live site shows phone, WhatsApp and email instead.
              </DevNote>
            )}
            {showForm ? (
              <EnquiryForm
                variant="quote"
                endpoint={endpoints.enquiry}
                preview={!endpoints.enquiry}
                email={site.contact.email}
                phone={site.contact.phoneDisplay}
                maxUploadMb={site.maxUploadMb}
              />
            ) : (
              <p>
                Email a short description of the project, its location and any drawings to{" "}
                <a href={links.email}>{site.contact.email}</a>, or call or WhatsApp {site.contact.phoneDisplay}.
              </p>
            )}
          </div>
          <aside className={p.formAside} aria-labelledby="next-title">
            <h2 id="next-title">What happens next</h2>
            <ol className={p.steps}>
              <li>We read your request and check it is work we can help with.</li>
              <li>We reply with any questions about the project.</li>
              <li>We send a written quote. Nothing is charged until you accept it.</li>
            </ol>
            <h2>Prefer to talk?</h2>
            <ContactOptions />
          </aside>
        </div>
      </section>
    </>
  );
}
