import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Whitestone Civil Engineering Ltd uses personal information collected through this website.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  const { company, contact } = site;
  const email = <a href={links.email}>{contact.email}</a>;
  return (
    <>
      <PageHero crumbs={[{ label: "Privacy notice" }]} title="Privacy notice." lead="How we use personal information collected through this website and when you contact us." />
      <section className="section">
        <div className={`container ${p.prose}`}>
          <p>
            <Tbc>Draft privacy notice. The company must confirm the details marked below, and it should be checked by someone with data protection knowledge before launch.</Tbc>
          </p>

          <h2>Who we are</h2>
          <p>
            {company.legalName} (company number {company.number}, registered in {company.registeredIn}) is the controller of the
            personal information described in this notice. Our registered office is {company.registeredOffice}.
          </p>
          <p>For any question about this notice or your information, email {email}.</p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Quote requests:</strong> your name, company name (if given), email address, telephone number, the services you are interested in, the project location and description, your expected start date and budget (if given), and any files you attach, such as drawings, specifications or photographs.</li>
            <li><strong>Contact messages:</strong> your name, email address, telephone number (if given) and your message.</li>
            <li><strong>Newsletter:</strong> your email address, if you subscribe or tick the updates box on a form.</li>
            <li><strong>Job enquiries:</strong> the CV and information you choose to send us by email.</li>
            <li><strong>Calls, WhatsApp and email:</strong> the information you share with us, including any attachments.</li>
          </ul>
          <p>Please do not send sensitive personal information, such as health details, as we do not need it.</p>

          <h2>How we use it and why</h2>
          <ul>
            <li>To respond to your enquiry and prepare a quote: steps you have asked us to take before entering into a contract.</li>
            <li>To carry out and administer work you instruct us to do: performance of our contract with you.</li>
            <li>To send occasional news and updates: your consent, which you can withdraw at any time using the unsubscribe link in each email or by emailing us.</li>
            <li>To consider you for future roles: our legitimate interest in recruiting. You can ask us to delete your CV at any time.</li>
          </ul>
          <p><Tbc>Confirm these lawful bases</Tbc></p>

          <h2>Who we share it with</h2>
          <p>
            We use service providers to host this website, deliver form messages and send our newsletter: <Tbc>website hosting provider</Tbc>,{" "}
            <Tbc>form delivery provider</Tbc> and <Tbc>newsletter provider</Tbc>. They process information only on our instructions. WhatsApp
            messages are handled by WhatsApp under its own terms.
          </p>
          <p><Tbc>Whether any information is transferred outside the UK, and the safeguards used</Tbc></p>
          <p>We do not sell your information.</p>

          <h2>How long we keep it</h2>
          <p><Tbc>Retention periods: enquiries that do not proceed, client project records, newsletter subscriptions and CVs</Tbc></p>

          <h2>Cookies and website statistics</h2>
          <p>See our <Link href="/cookies/">cookie information</Link>.</p>

          <h2>Your rights</h2>
          <p>
            You have the right to ask for a copy of your information, and to ask us to correct, delete or restrict it. You can also
            object to how we use it, withdraw consent you have given, and in some cases ask us to transfer it. To make a request,
            email {email}.
          </p>
          <p>
            If you are unhappy with how we have handled your information, you can complain to the{" "}
            <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner’s Office</a>. We would appreciate the chance to
            resolve your concern first.
          </p>

          <h2>Changes to this notice</h2>
          <p>Last updated: <Tbc>date of publication</Tbc>.</p>
        </div>
      </section>
    </>
  );
}
