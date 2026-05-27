import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, TrendingUp } from "lucide-react";
import { articles } from "./[slug]/contentData";

export const metadata: Metadata = {
  title: "Content | SiteScope",
  description:
    "Conversion-focused website growth guides from SiteScope.",
};

export default function ContentIndexPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B0F1A]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">SiteScope</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-semibold text-gray-300">
            <Link href="/" className="transition-colors hover:text-white">
              Analyze
            </Link>
            <Link href="/services" className="transition-colors hover:text-white">
              Services
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-gray-800 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-teal-200">
            <TrendingUp className="h-4 w-4" />
            Growth content
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Learn why most websites fail to convert
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl">
            Practical guides that turn hidden website problems into clear next
            steps.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3 md:py-16">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/content/${article.slug}`}
            className="group flex min-h-[280px] flex-col justify-between rounded-2xl border border-gray-800 bg-[#111827] p-6 transition-all hover:-translate-y-1 hover:border-teal-400/60"
          >
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-black text-blue-300">
                {index + 1}
              </div>
              <p className="mb-3 text-sm font-black uppercase tracking-wide text-teal-300">
                {article.eyebrow}
              </p>
              <h2 className="text-2xl font-black leading-tight text-white">
                {article.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {article.description}
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition-all group-hover:gap-3">
              Read guide
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
