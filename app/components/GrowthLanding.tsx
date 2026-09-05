"use client";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import AuditUrlForm from "@/app/content/[slug]/AuditUrlForm";
import { useTranslation } from "@/lib/i18n";
import type { GrowthPage } from "@/lib/growthPages";

export default function GrowthLanding({ page }: { page: GrowthPage }) {
  const { language } = useTranslation();
  const zh = language === "zh";
  return <main><SiteHeader /><article className="mx-auto max-w-5xl px-6 py-12">
    <h1 className="text-4xl font-bold leading-tight md:text-5xl">{zh ? page.zhTitle : page.title}</h1>
    <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-300">{zh ? page.zhDescription : page.description}</p>
    <div className="mt-8"><AuditUrlForm buttonLabel={zh ? "获取免费审计" : "Get Free Audit"} /></div>
    <p className="my-10 border-y border-gray-800 py-6 text-gray-400">{zh ? page.zhAudience : page.audience}</p>
    <div className="space-y-10">{page.checks.map(([heading, body, zhHeading, zhBody]) => <section key={heading}><h2 className="text-2xl font-bold">{zh ? zhHeading : heading}</h2><p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{zh ? zhBody : body}</p></section>)}</div>
    <section className="mt-12 border-t border-gray-800 pt-8"><h2 className="text-2xl font-bold">{zh ? "常见问题" : "Frequently asked questions"}</h2>{page.faq.map(([q, a, zq, za]) => <details key={q} className="border-b border-gray-800 py-5"><summary className="cursor-pointer font-semibold">{zh ? zq : q}</summary><p className="mt-3 leading-relaxed text-gray-300">{zh ? za : a}</p></details>)}</section>
    <nav aria-label="Related resources" className="mt-10 flex flex-wrap gap-6 text-teal-300 underline"><Link href={`/content/${page.related}`}>{zh ? "阅读相关指南" : "Read the related guide"}</Link><Link href="/sample-report">{zh ? "查看示例报告" : "View sample report"}</Link><Link href="/#pricing">{zh ? "比较免费与 Pro" : "Compare Free and Pro"}</Link><Link href="/free-website-audit">{zh ? "开始免费审计" : "Run Free Audit"}</Link></nav>
  </article></main>;
}
