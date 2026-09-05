"use client";
import type { SearchVisibility as Scores } from "@/lib/reports/types";
import { useTranslation } from "@/lib/i18n";

export default function SearchVisibility({ scores }: { scores?: Scores }) {
  const { language } = useTranslation();
  const zh = language === "zh";
  const labels = zh ? ["实体清晰度", "内容结构", "证据与信任", "结构化数据", "可回答性", "主题覆盖代理指标"] : ["Entity clarity", "Content structure", "Evidence & trust", "Structured data", "Answerability", "Topical coverage proxy"];
  return <section className="my-10 border-y border-gray-800 py-8">
    <h2 className="text-2xl font-bold">{zh ? "搜索可见性" : "Search Visibility"}</h2>
    <p className="mt-3 text-sm text-gray-400">{zh ? "单页就绪度，不是搜索排名或 AI 引用概率。未验证全站、来源质量或实体跨页一致性。" : "Single-page readiness, not a ranking or AI citation probability. Site-wide coverage, source quality, and cross-page entity consistency are not verified."}</p>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">{["Traditional Search (SEO)", "AI Search Visibility (GEO)"].map((label, i) => <div key={label}><h3 className="font-semibold">{zh ? ["传统搜索（SEO）", "AI 搜索就绪度（GEO）"][i] : label}</h3><p className="mt-2 text-3xl text-teal-300">{scores ? `${i ? scores.geo_score : scores.seo_score}/100` : (zh ? "未测量" : "Not measured")}</p></div>)}</div>
    {scores && <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.values(scores.categories).map((value, i) => <div key={labels[i]} className="flex justify-between gap-3 text-sm"><dt className="text-gray-400">{labels[i]}</dt><dd>{value}/100</dd></div>)}</dl>}
    {scores?.index_restricted && <p className="mt-4 text-amber-300">{zh ? "检测到索引或摘要限制。请先确认这些限制是否符合页面用途。" : "Index or snippet restrictions were detected. Confirm whether they are intentional for this page."}</p>}
  </section>;
}
