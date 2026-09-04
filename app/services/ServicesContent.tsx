"use client";

import Link from "next/link";
import { ArrowRight, Building2, Gauge, SearchCheck, Sparkles } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { useTranslation } from "@/lib/i18n";

const serviceIcons = [SearchCheck, Gauge, Sparkles, Building2];

const copy = {
  en: {
    eyebrow: "Services",
    title: "From audit to growth system",
    description: "Choose the right level of help: discover what is broken, fix what matters, rebuild what limits growth, or design a custom enterprise workflow.",
    services: [
      { id: "ai-website-audit", title: "AI Website Audit", tagline: "Discover the problems.", description: "Find the hidden conversion, SEO, performance, and structure problems holding your website back.", points: ["AI-powered website diagnosis", "SEO, UX, content, and CTA review", "Clear priorities instead of guesswork"], cta: "Start with a free audit", href: "/" },
      { id: "website-optimization", title: "Website Optimization", tagline: "Fix the problems.", description: "Turn audit findings into practical improvements across speed, messaging, layout, and conversion flow.", points: ["Performance and mobile experience fixes", "Conversion-focused page structure", "Messaging and content improvements"], cta: "Talk to us", href: "/contact" },
      { id: "website-build-redesign", title: "Website Build & Redesign", tagline: "Rebuild the growth system.", description: "Build or rebuild a modern website designed around trust, clarity, conversion, and measurable growth.", points: ["High-converting website redesign", "Landing pages and service pages", "Modern frontend implementation"], cta: "Plan a rebuild", href: "/contact" },
      { id: "enterprise-solutions", title: "Enterprise Solutions", tagline: "Advanced customization.", description: "Custom audit workflows, reporting, integrations, and optimization systems for larger teams.", points: ["Custom scoring and reporting", "Team workflows and integrations", "Advanced website growth systems"], cta: "Discuss enterprise needs", href: "/contact" },
    ],
    unsure: "Not sure what you need?",
    unsureCopy: "Start with a free audit, then use the results to decide whether you need optimization, a rebuild, or a custom solution.",
    audit: "Get Free Audit",
    contact: "Contact Us",
  },
  zh: {
    eyebrow: "服务",
    title: "从网站审计到增长系统",
    description: "选择适合你的支持方式：发现问题、解决关键问题、重建限制增长的网站，或设计企业级定制方案。",
    services: [
      { id: "ai-website-audit", title: "AI 网站审计", tagline: "发现问题。", description: "找出阻碍网站增长的转化、SEO、性能和页面结构问题。", points: ["AI 驱动的网站诊断", "SEO、用户体验、内容和 CTA 检查", "明确优先级，停止盲目猜测"], cta: "开始免费审计", href: "/" },
      { id: "website-optimization", title: "网站优化", tagline: "解决问题。", description: "把审计发现转化为速度、文案、布局和转化路径上的实际改进。", points: ["性能与移动端体验优化", "以转化为目标的页面结构", "文案与内容优化"], cta: "联系我们", href: "/contact" },
      { id: "website-build-redesign", title: "网站建设与改版", tagline: "重建增长系统。", description: "围绕信任、清晰表达、转化和可衡量增长，建设或重建现代网站。", points: ["高转化网站改版", "落地页与服务页面", "现代前端开发实施"], cta: "规划网站重建", href: "/contact" },
      { id: "enterprise-solutions", title: "企业解决方案", tagline: "高级定制。", description: "为大型团队定制审计流程、报告、系统集成和持续优化方案。", points: ["定制评分与报告", "团队工作流与系统集成", "高级网站增长系统"], cta: "咨询企业方案", href: "/contact" },
    ],
    unsure: "不确定需要哪项服务？",
    unsureCopy: "先进行一次免费审计，再根据结果判断需要网站优化、重新建设，还是定制解决方案。",
    audit: "获取免费审计",
    contact: "联系我们",
  },
};

export default function ServicesContent() {
  const { language } = useTranslation();
  const content = copy[language];

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <SiteHeader />
      <section className="border-b border-gray-800 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-black uppercase text-teal-300">{content.eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">{content.title}</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl">{content.description}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-2 md:py-16">
        {content.services.map((service, index) => {
          const Icon = serviceIcons[index];
          return (
            <article id={service.id} key={service.id} className="rounded-lg border border-gray-800 bg-[#111827] p-6 transition-colors hover:border-teal-400/60">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300"><Icon className="h-6 w-6" /></div>
                <div><div className="text-sm font-black text-gray-500">0{index + 1}</div><h2 className="mt-1 text-2xl font-black">{service.title}</h2><p className="mt-2 text-lg font-black text-teal-300">{service.tagline}</p></div>
              </div>
              <p className="mt-6 leading-relaxed text-gray-300">{service.description}</p>
              <ul className="mt-6 space-y-3 text-sm font-semibold text-gray-300">
                {service.points.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />{point}</li>)}
              </ul>
              <Link href={service.href} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-black transition-colors hover:bg-white/15">{service.cta}<ArrowRight className="h-4 w-4" /></Link>
            </article>
          );
        })}
      </section>
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-lg border border-teal-400/30 bg-teal-400/10 p-8 text-center">
          <h2 className="text-3xl font-black">{content.unsure}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-300">{content.unsureCopy}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-3 font-black">{content.audit}</Link>
            <Link href="/contact" className="rounded-xl border border-gray-700 px-6 py-3 font-black hover:border-teal-300">{content.contact}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
