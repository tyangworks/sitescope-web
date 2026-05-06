import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteScope | AI Website Auditor",
  description:
    "SiteScope delivers actionable website audits, SEO diagnostics, and conversion recommendations in minutes.",
  openGraph: {
    title: "SiteScope | AI Website Auditor",
    description:
      "Get fast, practical website audit reports with clear fixes and growth insights.",
    type: "website",
    url: "https://sitescope.fyi",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
