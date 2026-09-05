import { notFound } from "next/navigation";
import { growthPages } from "@/lib/growthPages";
import { publicMetadata } from "@/lib/seo";
import GrowthLanding from "@/app/components/GrowthLanding";
export const dynamicParams = false;
export function generateStaticParams() { return growthPages.map(({ slug }) => ({ landing: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const page = growthPages.find((p) => p.slug === landing);
  if (!page) return {};
  return publicMetadata(`${page.title} | SiteScope`, page.description, `/${page.slug}`);
}
export default async function Landing({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const page = growthPages.find((p) => p.slug === landing);
  if (!page) notFound();
  return <GrowthLanding page={page} />;
}
