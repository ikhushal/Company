import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactOptions, PageHero } from "@/components/Sections";
import { DevNote } from "@/components/Tbc";
import { endpoints, isProduction, links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Whitestone Civil Engineering by phone, WhatsApp or email, or send a message. For project details and pricing, request a quote.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const showForm = Boolean(endpoints.enquiry) || !isProduction;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        title="Let’s talk about your project."
        lead="Call, WhatsApp or email, or send a message below. For project details and pricing, request a quote and attach any drawings."
      />
      <section className="section" aria-label="Contact">
        <div className={`container ${p.formLayout}`}>
          <div className="flow" style={{ ["--flow" as string]: "1.5rem" }}>
            <h2 style={{ fontSize: "var(--fs-h3)" }}>Send a message</h2>
            {!endpoints.enquiry && (
              <DevNote>
                Preview: this form is not connected yet, so nothing will be sent. Set <code>NEXT_PUBLIC_ENQUIRY_ENDPOINT</code>.
                Without it, the live site shows phone, WhatsApp and email instead.
              </DevNote>
            )}
            {showForm ? (
              <EnquiryForm
                variant="contact"
                endpoint={endpoints.enquiry}
                preview={!endpoints.enquiry}
                email={site.contact.email}
                phone={site.contact.phoneDisplay}
                maxUploadMb={site.maxUploadMb}
              />
            ) : (
              <p>
                Email <a href={links.email}>{site.contact.email}</a>, or call or WhatsApp {site.contact.phoneDisplay}.
              </p>
            )}
          </div>
          <aside className={p.formAside} aria-labelledby="direct-title">
            <h2 id="direct-title">Contact us directly</h2>
            <ContactOptions includeOffice />
            <div className={p.meta}>
              <span className={p.metaLabel}>Areas covered</span>
              <span>{site.serviceArea}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
