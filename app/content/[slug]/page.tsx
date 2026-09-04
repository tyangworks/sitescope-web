import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentArticleContent from "./ContentArticleContent";
import { articles, getArticle } from "./contentData";
import { getZhArticle } from "./contentData.zh";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Content | SiteScope" };
  return {
    title: `${article.title} | SiteScope`,
    description: article.description,
    openGraph: {
      title: `${article.title} | SiteScope`,
      description: article.description,
      type: "article",
      url: `https://sitescope.fyi/content/${article.slug}`,
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  const zhArticle = getZhArticle(slug);
  if (!article || !zhArticle) notFound();
  return <ContentArticleContent article={article} zhArticle={zhArticle} />;
}
