import type { Metadata } from "next";
import ContentIndexContent from "./ContentIndexContent";

export const metadata: Metadata = {
  title: "Content | SiteScope",
  description: "Conversion-focused website growth guides from SiteScope.",
};

export default function ContentIndexPage() {
  return <ContentIndexContent />;
}
