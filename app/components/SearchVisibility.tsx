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
    <details className="mt-5 text-sm text-gray-400">
      <summary className="cursor-pointer text-gray-200">{zh ? "评分如何计算？" : "How is the score calculated?"}</summary>
      <p className="mt-3">{scores?.scoring ? (zh ? "评分模型 v3：搜索 40、内容 30、转化信号 20、性能 10。未测量维度不会被伪装成通过，但单页审计会对未测量的真实用户性能、全站覆盖和真实转化数据进行可信度折减。搜索中 SEO 占 80%，GEO 占 20%。相同观察得到相同分数，AI 不决定分数。" : "Model v3: Search 40, content 30, conversion signals 20, performance 10. Unmeasured dimensions are not treated as passes, and single-page audits receive a confidence adjustment for missing real-user performance, site-wide coverage and real conversion data. Search combines 80% SEO and 20% GEO. Identical observations produce the same score, independent of AI.") : (zh ? "这份历史报告使用旧版评分，不能与 v3 直接比较。重新审计可获得更保守、可复算的新评分。" : "This historical report uses an older score and is not directly comparable with v3. Rerun the audit for the calibrated, reproducible score.")}</p>
      {scores?.scoring && <p className="mt-2">{zh ? "性能：未测量。转化分是页面信号检查，不是真实转化率。明确禁止索引的页面综合分上限为 60，请先确认是否有意设置。" : "Performance: not measured. Conversion is a page-signal check, not an observed conversion rate. An explicit noindex restriction caps the overall score at 60; first check whether it is intentional."}</p>}
    </details>
  </section>;
}
