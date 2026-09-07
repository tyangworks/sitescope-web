import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
export { SITE_URL } from "@/lib/brand";
export function publicMetadata(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", siteName: BRAND_NAME }, twitter: { card: "summary", title, description } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
