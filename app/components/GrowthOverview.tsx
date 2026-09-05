"use client";
import Link from "next/link";
import { Search, Gauge, FileText, MousePointerClick } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function GrowthOverview() {
  const { language } = useTranslation();
  const zh = language === "zh";
  const features = [
    [Search, zh ? "搜索可见性" : "Search Visibility", zh ? "传统搜索（SEO）与 AI 搜索（GEO）：检查页面是否容易被发现和理解。" : "Traditional search (SEO) and AI search (GEO): check whether your page is discoverable and understandable.", "/website-seo-audit"],
    [Gauge, zh ? "性能" : "Performance", zh ? "找出浏览体验中的阻碍，再用真实用户数据验证速度。" : "Identify browsing friction and validate speed with real-user performance data.", "/free-website-audit"],
    [FileText, zh ? "内容与信息" : "Content & Messaging", zh ? "让访客理解你的服务、适用人群和选择理由。" : "Help visitors understand your offer, who it serves, and why it matters.", "/content/website-mistakes"],
    [MousePointerClick, zh ? "转化" : "Conversion", zh ? "检查行动按钮、信任信号和下一步是否清晰。" : "Review calls to action, trust signals, and the next step in the visitor journey.", "/website-conversion-audit"],
  ] as const;
  return <section className="border-y border-gray-800 px-6 py-14">
    <div className="mx-auto max-w-6xl">
      <h2 className="text-3xl font-bold">{zh ? "四个维度，明确下一步" : "Four areas. A clearer next step."}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon, title, description, href]) => <div key={title}><Icon className="mb-4 h-6 w-6 text-teal-300" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 leading-relaxed text-gray-400">{description}</p><Link className="mt-4 inline-block text-blue-300 underline" href={href}>{zh ? "查看检查内容" : "Explore the checks"}</Link></div>)}</div>
      <div className="mt-12 border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-bold">{zh ? "SiteScope 如何分析网站" : "How SiteScope analyzes your website"}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-400">{zh ? "浏览器抓取页面结构、SEO、AI 搜索就绪度、性能相关信号、内容和转化线索，AI 再解释这些观察。SEO/GEO 就绪分按固定规则计算；综合评分是启发式评估。单页分析不代表真实用户性能、全站覆盖或 AI 排名。" : "A browser crawl captures structure, SEO, AI-search readiness, performance-related signals, content, and conversion patterns. AI interprets those observations. SEO/GEO readiness uses fixed rules; the overall score is a heuristic assessment. A single-page audit does not measure real-user performance, full-site coverage, or AI rankings."}</p>
        <Link href="/sample-report" className="mt-5 inline-block font-semibold text-teal-300 underline">{zh ? "查看示例报告" : "View a sample report"}</Link>
      </div>
    </div>
  </section>;
}
