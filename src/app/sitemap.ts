import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { isProduction, site } from "@/content/site";

export const dynamic = "force-static";

const routes = ["/", "/services/", "/sectors/", "/projects/", "/about/", "/careers/", "/contact/", "/request-a-quote/", "/privacy/", "/cookies/", "/accessibility/"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];
  const now = new Date();
  return [...routes, ...services.map((s) => `/services/${s.slug}/`)].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
  }));
}
