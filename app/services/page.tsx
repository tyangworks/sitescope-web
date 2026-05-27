import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Gauge,
  Globe,
  SearchCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | SiteScope",
  description:
    "AI website audits, optimization, redesign, and enterprise growth solutions from SiteScope.",
};

const services = [
  {
    id: "ai-website-audit",
    title: "AI Website Audit",
    zh: "发现问题。",
    description:
      "Find the hidden conversion, SEO, performance, and structure problems holding your website back.",
    icon: SearchCheck,
    points: [
      "AI-powered website diagnosis",
      "SEO, UX, content, and CTA review",
      "Clear priorities instead of guesswork",
    ],
    cta: "Start with a free audit",
    href: "/",
  },
  {
    id: "website-optimization",
    title: "Website Optimization",
    zh: "解决问题。",
    description:
      "Turn audit findings into practical improvements across speed, messaging, layout, and conversion flow.",
    icon: Gauge,
    points: [
      "Performance and mobile experience fixes",
      "Conversion-focused page structure",
      "Messaging and content improvements",
    ],
    cta: "Talk to us",
    href: "/contact",
  },
  {
    id: "website-build-redesign",
    title: "Website Build & Redesign",
    zh: "重建增长系统。",
    description:
      "Build or rebuild a modern website designed around trust, clarity, conversion, and measurable growth.",
    icon: Sparkles,
    points: [
      "High-converting website redesign",
      "Landing pages and service pages",
      "Modern frontend implementation",
    ],
    cta: "Plan a rebuild",
    href: "/contact",
  },
  {
    id: "enterprise-solutions",
    title: "Enterprise Solutions",
    zh: "高级定制。",
    description:
      "Custom audit workflows, reporting, integrations, and optimization systems for larger teams.",
    icon: Building2,
    points: [
      "Custom scoring and reporting",
      "Team workflows and integrations",
      "Advanced website growth systems",
    ],
    cta: "Discuss enterprise needs",
    href: "/contact",
  },
];

export default function ServicesPage() {
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
            <Link href="/content" className="transition-colors hover:text-white">
              Content
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-gray-800 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-black uppercase tracking-wide text-teal-300">
            Services
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            From audit to growth system
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl">
            Choose the right level of help: discover what is broken, fix what
            matters, rebuild what limits growth, or design a custom enterprise
            workflow.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-2 md:py-16">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <article
              id={service.id}
              key={service.id}
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition-all hover:border-teal-400/60"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-500">
                    0{index + 1}
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-white">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-lg font-black text-teal-300">
                    {service.zh}
                  </p>
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-gray-300">
                {service.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm font-semibold text-gray-300">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-300" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href={service.href}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-black text-white transition-all hover:bg-white/15"
              >
                {service.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-2xl border border-teal-400/30 bg-teal-400/10 p-8 text-center">
          <h2 className="text-3xl font-black">Not sure what you need?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-300">
            Start with a free audit, then use the results to decide whether you
            need optimization, a rebuild, or a custom solution.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-3 font-black text-white hover:opacity-90"
            >
              Get Free Audit
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-gray-700 px-6 py-3 font-black text-white hover:border-teal-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
