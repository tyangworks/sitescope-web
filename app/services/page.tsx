import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services | sitescope.fyi",
  description:
    "AI website audits, optimization, redesign, and enterprise growth solutions from sitescope.fyi.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
