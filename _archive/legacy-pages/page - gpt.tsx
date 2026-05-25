"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAnalyze = () => {
    if (!url) return;
    window.location.href = `/audit?url=${encodeURIComponent(url)}`;
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="text-xl font-bold">SiteScope</div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/pricing">Pricing</Link>
            <Link href="/build">Build</Link>
            <Link href="/login">Sign in</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/audit"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Get Audit
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-3">
            <Link href="/pricing" className="block">
              Pricing
            </Link>
            <Link href="/build" className="block">
              Build
            </Link>
            <Link href="/login" className="block">
              Sign in
            </Link>
            <Link
              href="/audit"
              className="block bg-black text-white text-center py-2 rounded-lg"
            >
              Get Audit
            </Link>
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="min-h-screen bg-white text-gray-900">

        {/* HERO */}
        <section className="px-6 py-20 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            See What’s Holding Your Growth Back
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            AI-powered website audits that show you exactly what to fix — and how to grow faster.
          </p>

          {/* INPUT */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
            <input
              type="text"
              placeholder="Enter your website URL..."
              className="px-4 py-3 w-full md:w-96 border rounded-xl outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90"
            >
              Get Free Audit
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            No signup required • Results in 2 minutes
          </p>
        </section>

        {/* SOCIAL PROOF / TRUST */}
        <section className="text-center text-gray-500 pb-10">
          Trusted by founders, marketers, and growing businesses
        </section>

        {/* PAIN */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-semibold">
              Most websites don’t fail because of traffic
            </h2>

            <p className="mt-2 text-gray-600">
              They fail because of hidden issues
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-10 text-left">
              <div className="p-6 bg-white rounded-xl shadow">
                Slow performance that kills conversions
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                SEO gaps blocking organic growth
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                Content that doesn’t convert
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                Weak call-to-action and poor UX
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div>
              <h3 className="font-semibold">1. Enter your URL</h3>
              <p className="text-gray-600 mt-2">
                Add your website and start instantly
              </p>
            </div>

            <div>
              <h3 className="font-semibold">2. We analyze everything</h3>
              <p className="text-gray-600 mt-2">
                SEO, performance, content & structure
              </p>
            </div>

            <div>
              <h3 className="font-semibold">3. Get clear actions</h3>
              <p className="text-gray-600 mt-2">
                Fix what matters and grow faster
              </p>
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section className="bg-gray-50 py-16 px-6 text-center">
          <h2 className="text-3xl font-semibold">
            Not Just Data — Real Insights
          </h2>

          <p className="mt-4 text-gray-600">
            We show you exactly what to fix first
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto text-left">
            <div className="p-6 bg-white rounded-xl shadow">
              SEO & keyword gaps
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              Technical performance issues
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              UX & conversion blockers
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              Growth opportunities
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-20 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">Simple pricing</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="border p-6 rounded-xl">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="mt-4 text-gray-600">
                Basic audit & key insights
              </p>
              <button className="mt-6 w-full border py-2 rounded-lg">
                Try Free
              </button>
            </div>

            <div className="border-2 border-black p-6 rounded-xl">
              <h3 className="text-xl font-semibold">Pro</h3>
              <p className="mt-4 text-gray-600">
                Full report + fix plan
              </p>
              <button className="mt-6 w-full bg-black text-white py-2 rounded-lg">
                Upgrade
              </button>
            </div>

            <div className="border p-6 rounded-xl">
              <h3 className="text-xl font-semibold">Custom</h3>
              <p className="mt-4 text-gray-600">
                Expert analysis & build services
              </p>
              <button className="mt-6 w-full border py-2 rounded-lg">
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 px-6 text-center bg-black text-white">
          <h2 className="text-3xl font-semibold">
            Start improving your site today
          </h2>

          <button
            onClick={handleAnalyze}
            className="mt-6 px-8 py-3 bg-white text-black rounded-xl"
          >
            Get Free Audit
          </button>
        </section>

      </main>
    </>
  );
}