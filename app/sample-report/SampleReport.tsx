"use client";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SearchVisibility from "@/app/components/SearchVisibility";
import { useTranslation } from "@/lib/i18n";

export default function SampleReport() {
  const { language } = useTranslation();
  const zh = language === "zh";
  const issues = zh ? [
    ["传统搜索（SEO）", "页面标题没有说明服务地区", "中", "搜索者难以判断服务是否适用", "在标题和正文中准确说明服务地区。"],
    ["AI 搜索（GEO）", "机构身份缺少明确上下文", "中", "来源与服务的关系不清晰", "补充真实公司简介与联系方式，再添加匹配的机构标记。"],
    ["性能", "首页大图未设置尺寸", "中", "加载过程中内容可能移动", "设置图片宽高并在真实设备上测量布局偏移。"],
    ["内容与信息", "服务介绍只有泛泛口号", "中", "客户无法判断适用范围", "补充服务流程、限制和真实案例。"],
    ["转化", "咨询按钮没有说明提交后流程", "高", "用户不确定下一步", "说明回复方式与实际可兑现的处理时间。"],
  ] : [
    ["Traditional Search (SEO)", "Title omits the service area", "Medium", "Visitors cannot judge whether the service applies", "State the actual service area in the title and visible copy."],
    ["AI Search (GEO)", "Organization identity lacks context", "Medium", "The connection between the source and service is unclear", "Add real company and contact details, then matching organization markup."],
    ["Performance", "Hero image has no reserved dimensions", "Medium", "Content may move during loading", "Set image dimensions and measure layout shift on real devices."],
    ["Content & Messaging", "Service copy contains only broad claims", "Medium", "Customers cannot assess fit", "Explain the process, limitations and real examples."],
    ["Conversion", "Enquiry CTA leaves follow-up unclear", "High", "Visitors do not know what happens next", "Explain the reply method and a response time you can actually meet."],
  ];
  return <main><SiteHeader /><article className="mx-auto max-w-5xl px-6 py-12">
    <p className="text-sm font-bold text-amber-300">{zh ? "虚构演示数据，不是客户报告" : "Illustrative fictional data. Not a customer report."}</p>
    <h1 className="mt-4 text-4xl font-bold">{zh ? "网站增长审计示例" : "Sample Website Growth Audit"}</h1>
    <p className="mt-6 text-xl">{zh ? "综合增长评分：68/100（演示）" : "Overall Growth Score: 68/100 (illustrative)"}</p>
    <SearchVisibility scores={{ version: 1, scope: "single_page", seo_score: 67, geo_score: 56, categories: { entityClarity: 50, contentStructure: 67, evidenceTrust: 33, structuredData: 50, answerability: 50, topicalAuthority: 83 }, index_restricted: false }} />
    <h2 className="text-2xl font-bold">{zh ? "免费预览与完整报告内容示例" : "Free preview and full-report examples"}</h2>
    <p className="mt-3 text-gray-400">{zh ? "实际匿名预览最多三个问题；此演示展示全部四个审计维度。" : "An actual anonymous preview shows at most three issues. This demonstration shows all four audit areas."}</p>
    <div className="mt-6 space-y-7">{issues.map(([category, issue, priority, impact, fix]) => <section key={category} className="border-b border-gray-800 pb-6"><p className="text-sm text-teal-300">{category} · {priority}</p><h3 className="mt-2 text-xl font-semibold">{issue}</h3><p className="mt-3 text-gray-400">{impact}</p><p className="mt-2">{fix}</p></section>)}</div>
    <section className="mt-10 border-l-2 border-teal-400 pl-6"><h2 className="text-2xl font-bold">{zh ? "Pro 修复计划示例" : "Pro Fix Plan example"}</h2><ol className="mt-4 list-decimal space-y-3 pl-5">{(zh ? ["确认公司公开名称、网址和真实联系方式。", "先更新页面可见内容，再添加与内容一致的 Organization JSON-LD。", "检查标记语法、重新审计页面，并在 Search Console 中观察索引与曝光。"] : ["Confirm the public business name, URL and real contact details.", "Update visible content first, then add Organization JSON-LD that matches it.", "Validate markup syntax, rerun the audit and monitor indexing and impressions in Search Console."]).map((step) => <li key={step}>{step}</li>)}</ol><p className="mt-4 text-sm text-gray-400">{zh ? "预期改善：身份表达更清晰，不保证排名或 AI 引用。" : "Expected improvement: clearer identity, without a ranking or AI citation guarantee."}</p></section>
    <div className="mt-10 flex flex-wrap gap-5"><Link href="/#audit" className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-black">{zh ? "运行免费审计" : "Run Your Free Audit"}</Link><Link href="/pro-audit" className="px-6 py-3 text-blue-300">{zh ? "查看 Pro" : "Explore Pro"}</Link></div>
  </article></main>;
}
