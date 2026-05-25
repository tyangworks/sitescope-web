"use client";

import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");

  const handleAnalyze = () => {
    if (!url) return;
    window.location.href = "/audit?url=" + encodeURIComponent(url);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-800">
        <div className="text-xl font-semibold tracking-tight">SiteScope</div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#" className="hover:text-white">
            Analyze
          </a>
          <a href="#" className="hover:text-white">
            Pricing
          </a>
          <a href="#" className="hover:text-white">
            Content
          </a>
          <a href="#" className="hover:text-white">
            Services
          </a>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-sm font-medium">
          Login
        </button>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          See What’s Holding Your Growth Back
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Analyze your website in seconds. Discover SEO issues, performance
          gaps, and conversion blockers — all powered by AI.
        </p>

        {/* INPUT */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Enter your website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full md:w-96 px-5 py-4 rounded-xl bg-[#111827] border border-gray-700 outline-none"
          />

          <button
            onClick={handleAnalyze}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 font-medium"
          >
            Get Free Audit
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          No signup required • Results in 2 minutes
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Enter URL",
            desc: "Input your website and start the analysis instantly.",
          },
          {
            title: "AI Analysis",
            desc: "We scan SEO, performance, and structure issues.",
          },
          {
            title: "Get Fix Plan",
            desc: "Receive actionable insights to improve growth.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-[#111827] border border-gray-800 rounded-2xl"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-8">
        {[
          "SEO Issues Detection",
          "Performance Insights",
          "Content Optimization",
          "Conversion Analysis",
        ].map((text, i) => (
          <div
            key={i}
            className="p-6 bg-[#111827] border border-gray-800 rounded-2xl"
          >
            <p className="text-gray-300">{text}</p>
          </div>
        ))}
      </section>

      {/* CONTENT PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Learn Why Websites Fail
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Why Your Website Gets Traffic But No Sales",
            "Top 10 Website Mistakes",
            "Stop Guessing: Improve with Data",
          ].map((title, i) => (
            <div
              key={i}
              className="p-6 bg-[#111827] border border-gray-800 rounded-2xl hover:border-gray-600 transition"
            >
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-gray-400">
                Discover insights to improve your site performance.
              </p>
              <div className="mt-4 text-blue-400 text-sm">Read more →</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-gray-800">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Find Out What’s Blocking Your Growth
        </h2>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4 px-6">
          <input
            type="text"
            placeholder="Enter your website URL..."
            className="w-full md:w-96 px-5 py-4 rounded-xl bg-[#111827] border border-gray-700"
          />

          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400">
            Get Free Audit
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-6 md:px-12 py-10 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div>© 2026 SiteScope</div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
