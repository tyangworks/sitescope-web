import type { Metadata } from "next";
import { Toaster } from "sonner";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";
import { jsonLd, SITE_URL } from "@/lib/seo";
import GrowthTracking from "./components/GrowthTracking";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sitescope.fyi"),
  title: "Website Growth Audit: SEO, GEO & Conversion | SiteScope",
  alternates: { canonical: "https://www.sitescope.fyi/" },
  description:
    "Find what is hurting website growth. Audit search visibility across SEO and AI search (GEO), content, performance signals and conversions with a prioritized fix plan.",
  openGraph: {
    title: "SiteScope | AI Website Auditor",
    description:
      "Get fast, practical website audit reports with clear fixes and growth insights.",
    type: "website",
    url: "https://www.sitescope.fyi",
    siteName: "SiteScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteScope | AI Website Auditor",
    description:
      "Website audits with clear fix plans and growth recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "SiteScope", url: SITE_URL, email: "support@sitescope.fyi" },
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "SiteScope", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
          { "@type": "WebApplication", name: "SiteScope", url: SITE_URL, applicationCategory: "BusinessApplication", operatingSystem: "Web browser", description: "Website growth audits covering search visibility, content, performance-related signals and conversion." },
        ] }) }} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <GrowthTracking />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
