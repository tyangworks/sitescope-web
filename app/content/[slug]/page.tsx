import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentArticleContent from "./ContentArticleContent";
import { articles, getArticle } from "./contentData";
import { getZhArticle } from "./contentData.zh";
import { SITE_URL, jsonLd, publicMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Content | SiteScope" };
  return {
    ...publicMetadata(`${article.title} | SiteScope`, article.description, `/content/${article.slug}`),
    title: `${article.title} | SiteScope`,
    description: article.description,
    openGraph: {
      title: `${article.title} | SiteScope`,
      description: article.description,
      type: "article",
      url: `${SITE_URL}/content/${article.slug}`,
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  const zhArticle = getZhArticle(slug);
  if (!article || !zhArticle) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: article.title, description: article.description, author: { "@type": "Organization", name: "SiteScope", url: SITE_URL }, mainEntityOfPage: `${SITE_URL}/content/${slug}` },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Content", item: `${SITE_URL}/content` }, { "@type": "ListItem", position: 2, name: article.title, item: `${SITE_URL}/content/${slug}` }] },
  ] }) }} /><ContentArticleContent article={article} zhArticle={zhArticle} /></>;
}
