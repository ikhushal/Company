import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealController } from "@/components/RevealController";
import { analyticsSrc, isProduction, site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Civil Engineering Design Consultancy in London | Whitestone",
    template: "%s | Whitestone Civil Engineering",
  },
  description: site.description,
  applicationName: site.name,
  // Preview builds must never be indexed: they contain unconfirmed content.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealController />
        {!isProduction && (
          <p className="preview-pill" role="note">
            <span aria-hidden="true">●</span> Preview build · highlighted items need confirming
          </p>
        )}
        {isProduction && analyticsSrc && <Script src={analyticsSrc} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
