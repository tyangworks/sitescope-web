"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { useTranslation } from "@/lib/i18n";
import { articles } from "./[slug]/contentData";
import { zhArticles } from "./[slug]/contentData.zh";

export default function ContentIndexContent() {
  const { language } = useTranslation();
  const [topic, setTopic] = useState("all");
  const localizedArticles = language === "zh" ? zhArticles : articles;
  const copy = language === "zh"
    ? { eyebrow: "增长内容", title: "了解为什么大多数网站无法转化", description: "把隐藏的网站问题转化为清晰下一步的实用指南。", read: "阅读指南" }
    : { eyebrow: "Growth content", title: "Learn why most websites fail to convert", description: "Practical guides that turn hidden website problems into clear next steps.", read: "Read guide" };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <SiteHeader />
      <section className="border-b border-gray-800 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black uppercase text-teal-200">
            <TrendingUp className="h-4 w-4" />{copy.eyebrow}
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl">{copy.description}</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 pt-8"><label htmlFor="content-topic" className="mr-3 text-gray-400">{language === "zh" ? "主题" : "Topic"}</label><select id="content-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-lg border border-gray-700 bg-[#111827] p-3">{[["all", "All guides", "全部指南"], ["growth", "Website Growth", "网站增长"], ["seo", "Search & SEO", "搜索与 SEO"], ["geo", "AI Search / GEO", "AI 搜索 / GEO"], ["conversion", "Conversion", "转化"], ["performance", "Performance", "性能"]].map(([value, en, zh]) => <option key={value} value={value}>{language === "zh" ? zh : en}</option>)}</select></div>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3 md:py-16">
        {localizedArticles.filter((article) => topic === "all" || (topic === "geo" ? !["why-no-sales", "website-mistakes", "stop-guessing"].includes(article.slug) : topic === "seo" ? ["seo-vs-geo", "website-mistakes"].includes(article.slug) : topic === "performance" ? article.slug === "website-mistakes" : topic === "conversion" ? article.slug === "why-no-sales" : ["why-no-sales", "website-mistakes", "stop-guessing"].includes(article.slug))).map((article, index) => (
          <Link key={article.slug} href={`/content/${article.slug}`} className="group flex min-h-[280px] flex-col justify-between rounded-lg border border-gray-800 bg-[#111827] p-6 transition-all hover:-translate-y-1 hover:border-teal-400/60">
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-sm font-black text-blue-300">{index + 1}</div>
              <p className="mb-3 text-sm font-black uppercase text-teal-300">{article.eyebrow}</p>
              <h2 className="text-2xl font-black leading-tight">{article.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{article.description}</p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition-all group-hover:gap-3">{copy.read}<ArrowRight className="h-4 w-4" /></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
