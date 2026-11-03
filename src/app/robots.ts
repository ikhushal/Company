import type { MetadataRoute } from "next";
import { isProduction, site } from "@/content/site";

export const dynamic = "force-static";

/** Preview builds are closed to search engines; production builds open with a sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
