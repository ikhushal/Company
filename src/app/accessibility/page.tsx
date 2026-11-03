import type { Metadata } from "next";
import { PageHero } from "@/components/Sections";
import { Tbc } from "@/components/Tbc";
import { links, site } from "@/content/site";
import p from "../pages.module.css";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "Accessibility statement for the Whitestone Civil Engineering website.",
  alternates: { canonical: "/accessibility/" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Accessibility" }]} title="Accessibility statement." />
      <section className="section">
        <div className={`container ${p.prose}`}>
          <p>This statement applies to {site.url.replace("https://", "")}.</p>
          <p>
            We want as many people as possible to be able to use this website. It is designed to meet the Web Content
            Accessibility Guidelines (WCAG) 2.2 at level AA. That means you should be able to:
          </p>
          <ul>
            <li>zoom in up to 400% without content being cut off or needing to scroll sideways</li>
            <li>navigate the whole website using a keyboard</li>
            <li>use the website with a screen reader</li>
            <li>use your device’s settings to reduce motion, which turns off the site’s animations</li>
          </ul>

          <h2>How accessible this website is</h2>
          <p><Tbc>Results of accessibility testing, including any known issues and when they will be fixed</Tbc></p>

          <h2>Feedback and contact</h2>
          <p>
            If you find a problem with this website, or need information in a different format, email{" "}
            <a href={links.email}>{site.contact.email}</a>. Please tell us the page address and what the problem is.
          </p>

          <h2>Preparation of this statement</h2>
          <p>
            This statement was prepared on <Tbc>date the statement was prepared</Tbc>, following{" "}
            <Tbc>description of the testing carried out and by whom</Tbc>.
          </p>
        </div>
      </section>
    </>
  );
}
