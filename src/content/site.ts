import data from "./site.json";

/**
 * Site-wide facts and settings.
 *
 * Business facts live in site.json so the launch-gate script
 * (scripts/check-launch.mjs) can read them too. Deployment-specific
 * values come from environment variables, documented in README.md.
 */

export type Project = {
  title: string;
  location: string;
  type: string;
  role: string;
  description: string;
  completed?: string;
  /** "company" for Whitestone work; "previous-role" for personal experience gained elsewhere. */
  context: "company" | "previous-role";
  /** Only projects the client has agreed to publish are shown. */
  permission: boolean;
};

export const site = {
  ...data,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? data.url,
  social: data.social as { name: string; url: string }[],
  projects: data.projects as Project[],
};

/** Preview builds are noindexed and highlight unconfirmed facts; production builds refuse to run while any remain. */
export const isProduction = process.env.NEXT_PUBLIC_SITE_MODE === "production";

export const endpoints = {
  enquiry: process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT || null,
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || null,
};

export const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC || null;
/** Provider name shown on the cookie page; required whenever analytics is enabled (see check-launch.mjs). */
export const analyticsName = process.env.NEXT_PUBLIC_ANALYTICS_NAME || "a statistics service";

export const links = {
  tel: `tel:${data.contact.phoneLink}`,
  whatsapp: `https://wa.me/${data.contact.whatsapp}`,
  email: `mailto:${data.contact.email}`,
  map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.company.registeredOffice)}`,
};

export const nav = [
  { label: "Services", href: "/services/" },
  { label: "Sectors", href: "/sectors/" },
  { label: "Projects", href: "/projects/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
