import type { MetadataRoute } from "next";
import { articles } from "./content/[slug]/contentData";
import { growthPages } from "@/lib/growthPages";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/services", "/content", "/contact", "/sample-report", "/pro-audit", ...growthPages.map((page) => `/${page.slug}`), ...articles.map((article) => `/content/${article.slug}`)].map((path) => ({ url: `${SITE_URL}${path}` }));
}
