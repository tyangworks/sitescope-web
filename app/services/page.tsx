import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services | SiteScope",
  description:
    "AI website audits, optimization, redesign, and enterprise growth solutions from SiteScope.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
