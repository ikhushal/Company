import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Sections";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Message sent",
  description: "Your message has been sent to Whitestone Civil Engineering. We will reply by email.",
  robots: { index: false, follow: false },
};

/** Landing page for form services that redirect after a non-JavaScript submission. */
export default function ThankYouPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Message sent" }]}
        title="Thank you. Your message has been sent."
        lead={`We will reply by email. If it is urgent, call or WhatsApp ${site.contact.phoneDisplay}.`}
      />
      <section className="section section--tight">
        <div className="container">
          <Link href="/" className="btn btn--primary">Return to the home page</Link>
        </div>
      </section>
    </>
  );
}
