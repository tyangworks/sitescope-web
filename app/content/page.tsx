import type { Metadata } from "next";
import ContentIndexContent from "./ContentIndexContent";

export const metadata: Metadata = {
  title: "Website Growth, SEO & GEO Guides | SiteScope",
  description: "Practical guides to search visibility, AI-search readiness, performance and website conversion.",
};

export default function ContentIndexPage() {
  return <ContentIndexContent />;
}
