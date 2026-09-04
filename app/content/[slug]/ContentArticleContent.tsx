"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { useTranslation } from "@/lib/i18n";
import AuditUrlForm from "./AuditUrlForm";
import type { ContentArticle } from "./contentData";

type Props = { article: ContentArticle; zhArticle: ContentArticle };

export default function ContentArticleContent({ article, zhArticle }: Props) {
  const { language } = useTranslation();
  const content = language === "zh" ? zhArticle : article;
  const back = language === "zh" ? "返回 SiteScope" : "Back to SiteScope";

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <SiteHeader />
      <article>
        <section className="border-b border-gray-800 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <Link href="/content" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" />{back}</Link>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black uppercase text-teal-200"><TrendingUp className="h-4 w-4" />{content.eyebrow}</div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">{content.title}</h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl">{content.description}</p>
            <div className="mt-10"><AuditUrlForm buttonLabel={content.primaryCta} /></div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <div className="space-y-16">
            {content.sections.map((section) => {
              if (section.type === "intro" || section.type === "simple") {
                return <section key={section.heading}><h2 className="text-3xl font-black md:text-4xl">{section.heading}</h2><div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>;
              }
              if (section.type === "list") {
                return <section key={section.heading}><h2 className="text-3xl font-black md:text-4xl">{section.heading}</h2><div className="mt-8 grid gap-4">{section.items.map((item, index) => <div key={item.title} className="rounded-lg border border-gray-800 bg-[#111827] p-6"><div className="flex items-start gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-sm font-black text-blue-300">{index + 1}</div><div><h3 className="text-xl font-black">{item.title}</h3><p className="mt-3 leading-relaxed text-gray-300">{item.body}</p>{item.takeaway && <p className="mt-4 font-black text-teal-300">{item.takeaway}</p>}{item.cta && <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-300">{item.cta}<ArrowRight className="h-4 w-4" /></p>}</div></div></div>)}</div></section>;
              }
              return <section key={section.heading}><h2 className="text-3xl font-black md:text-4xl">{section.heading}</h2><div className="mt-8 overflow-hidden rounded-lg border border-gray-800"><div className="grid grid-cols-2 bg-[#111827] text-sm font-black uppercase text-gray-400"><div className="border-r border-gray-800 p-4">{section.leftLabel}</div><div className="p-4 text-teal-300">{section.rightLabel}</div></div>{section.rows.map(([left, right]) => <div key={left} className="grid grid-cols-2 border-t border-gray-800"><div className="border-r border-gray-800 p-4 text-gray-400">{left}</div><div className="flex items-center gap-2 p-4 font-semibold"><CheckCircle2 className="h-4 w-4 shrink-0 text-teal-300" />{right}</div></div>)}</div></section>;
            })}
          </div>
        </div>

        <section className="border-y border-gray-800 bg-[#111827]/60 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-black md:text-5xl">{content.finalHeading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-gray-300">{content.finalCopy}</p>
            <div className="mx-auto mt-8 max-w-3xl"><AuditUrlForm buttonLabel={content.primaryCta} compact /></div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm font-bold text-gray-300 sm:flex-row">
              {content.secondaryLinks.map((link) => <Link key={link.href + link.label} href={link.href} className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-2 transition-colors hover:border-teal-400 hover:text-white">{link.label}<ArrowRight className="h-4 w-4" /></Link>)}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
