import type { NextConfig } from "next";

const origin = (url?: string) => {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
};

const formOrigins = [process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT, process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT]
  .map(origin)
  .filter(Boolean)
  .join(" ");
const analyticsOrigin = origin(process.env.NEXT_PUBLIC_ANALYTICS_SRC);

/**
 * Local QA only: the screenshot harness frames pages at phone widths, which the
 * anti-clickjacking headers below (correctly) forbid. Never set this for a
 * deployed build; Vercel builds do not set it.
 */
const allowFraming = process.env.QA_ALLOW_FRAMING === "1";

/**
 * Content-Security-Policy. Statically generated Next.js pages carry inline
 * bootstrap scripts, and nonces would force every page to render on demand,
 * so script-src needs 'unsafe-inline'. Everything else stays locked to this
 * origin plus the configured form and analytics services. Applied to
 * production builds only, as the dev server needs eval.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${analyticsOrigin}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${formOrigins} ${analyticsOrigin}`.replace(/\s+/g, " ").trim(),
  `form-action 'self' ${formOrigins}`.trim(),
  "base-uri 'self'",
  "object-src 'none'",
  allowFraming ? "" : "frame-ancestors 'none'",
].filter(Boolean).join("; ");

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  ...(allowFraming ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Keep the dev badge clear of the preview pill (bottom left).
  devIndicators: { position: "bottom-right" },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
