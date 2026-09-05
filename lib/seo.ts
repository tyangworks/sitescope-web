import type { Metadata } from "next";
export const SITE_URL = "https://www.sitescope.fyi";
export function publicMetadata(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", siteName: "SiteScope" }, twitter: { card: "summary", title, description } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
