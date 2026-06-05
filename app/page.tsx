"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Globe, MousePointer2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { normalizeUrlInput } from "@/lib/normalizeUrl";
import { useTranslation } from "@/lib/i18n"; // 添加翻译 hook

// Supabase Connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type RecentReport = {
  id: string;
  url: string;
  score: number;
  screenshot_url: string;
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation(); // 添加翻译 hook
  const normalizedPreview = normalizeUrlInput(url);

  const loadingMessages = [
    "🚀 Initializing cloud browser...",
    "📸 Capturing high-res visual snapshot...",
    "🧠 Analyzing SEO and structure...",
    "📊 Generating growth insights...",
  ];

  // Fetch recent reports for social proof
  useEffect(() => {
    async function fetchRecent() {
      const { data } = await supabase
        .from("reports")
        .select("id, url, score, screenshot_url")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setRecentReports(data);
    }
    fetchRecent();
  }, []);

  // Loading text rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < loadingMessages.length - 1 ? prev + 1 : prev,
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = normalizeUrlInput(url);

    if (!normalizedUrl.url) {
      setError(normalizedUrl.error);
      return;
    }

    setUrl(normalizedUrl.url);
    setError("");
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";

      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to report detail page
      router.push(`/report/${data.id}`);
    } catch (error: unknown) {
      setError(
        errorMessage(
          error,
          "Connection failed. Make sure the server is running.",
        ),
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white selection:bg-blue-900">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SiteScope</span>
          </div>

          {/* Desktop Menu 部分添加语言切换器 */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">{t.nav.analyze}</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">{t.nav.pricing}</Link>
            <Link href="/content" className="hover:text-white transition-colors">{t.nav.content}</Link>
            <Link href="/services" className="hover:text-white transition-colors">{t.nav.services}</Link>
            <Link href="/reports" className="hover:text-white transition-colors">{t.nav.history}</Link>
  
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-[#111827] rounded-lg p-1 border border-gray-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-[#3A8DFF] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                language === 'zh' 
                  ? 'bg-[#3A8DFF] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              中
            </button>
          </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-sm font-medium hover:opacity-90 transition-all"
            >
              {t.nav.login}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu 部分也添加语言切换器 */}
      {menuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-gray-800">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.analyze}
            </Link>
            <Link
              href="#pricing"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.pricing}
            </Link>
            <Link
              href="/content"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.content}
            </Link>
            <Link
              href="/services"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.services}
            </Link>
            <Link
              href="/reports"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.history}
            </Link>
            
            {/* Mobile Language Switcher */}
      <div className="flex items-center gap-2 bg-[#111827] rounded-lg p-1 border border-gray-700 mt-4">
        <button
          onClick={() => setLanguage('en')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            language === 'en' 
              ? 'bg-[#3A8DFF] text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('zh')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            language === 'zh' 
              ? 'bg-[#3A8DFF] text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          中文
        </button>
      </div>
            
            <Link
              href="/login"
              className="block w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-sm font-medium hover:opacity-90 transition-all text-center mt-2"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            {t.home.heroTitle} <br />
            <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Growth Back
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-12 font-medium leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleAnalyze}
              className="relative flex flex-col md:flex-row items-center gap-4 p-2 bg-[#111827] rounded-2xl border border-gray-700"
            >
              <div className="flex-1 flex items-center pl-4 w-full">
                <MousePointer2 className="text-gray-500 w-6 h-6 mr-3" />
                <input
                  type="text"
                  inputMode="url"
                  value={url}
                  onBlur={() => {
                    const normalized = normalizeUrlInput(url);
                    if (normalized.url) setUrl(normalized.url);
                  }}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={t.home.heroPlaceholder}
                  className="w-full py-4 bg-transparent text-lg outline-none font-medium text-white placeholder-gray-500"
                  disabled={loading}
                  autoCapitalize="none"
                  autoComplete="url"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-invalid={Boolean(error)}
                />
              </div>
              <button
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  "Get Free Audit"
                )}
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-400 font-bold flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            {!error && url && normalizedPreview.url && normalizedPreview.url !== url && (
              <p className="mt-4 text-sm font-medium text-gray-400">
                We will audit:{" "}
                <span className="text-teal-300">{normalizedPreview.url}</span>
              </p>
            )}
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="mt-12 flex flex-col items-center">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-3">
                {loadingMessages[loadingStep]}
              </div>
              <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-400 animate-[pulse_2s_infinite]"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Results in less than 60 seconds
          </p>
          <Link
            href="/content/why-no-sales"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-bold text-teal-200 transition-all hover:border-teal-300 hover:bg-teal-400/15"
          >
            Learn why most websites fail
          </Link>
        </div>
      </section>

      {/* 3. RECENT AUDITS (Real Data) */}
      {recentReports.length > 0 && (
        <section className="bg-[#111827]/50 py-20 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest text-center mb-12">
              Recently Analyzed Sites
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentReports.map((report) => (
                <Link
                  href={`/report/${report.id}`}
                  key={report.id}
                  className="group bg-[#111827] rounded-2xl p-3 border border-gray-800 hover:border-gray-600 transition-all"
                >
                  <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gray-900">
                    <img
                      src={report.screenshot_url}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt="audit"
                    />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-gray-400 truncate max-w-[150px]">
                      {report.url}
                    </span>
                    <span className="text-xs font-black bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      Score: {report.score}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PAIN POINTS SECTION */}
      <section className="py-24 px-6 bg-[#0B0F1A]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 leading-tight text-white">
            {t.home.painPointsTitle}
          </h2>
          <p className="text-gray-400 text-lg mb-16">
            {t.home.painPointsSubtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-8 bg-[#111827] rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-red-400 font-bold">
                !
              </div>
              <p className="font-bold text-gray-300">
                Slow performance that kills 50%+ of mobile conversions.
              </p>
            </div>
            <div className="p-8 bg-[#111827] rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-red-400 font-bold">
                !
              </div>
              <p className="font-bold text-gray-300">
                SEO gaps blocking your business from organic growth.
              </p>
            </div>
            <div className="p-8 bg-[#111827] rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-red-400 font-bold">
                !
              </div>
              <p className="font-bold text-gray-300">
                Generic content that fails to engage and convert visitors.
              </p>
            </div>
            <div className="p-8 bg-[#111827] rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-red-400 font-bold">
                !
              </div>
              <p className="font-bold text-gray-300">
                Weak Call-to-Action and confusing user journeys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section
        id="pricing"
        className="py-24 px-6 bg-[#111827]/50 border-t border-gray-800"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-12 text-white">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#111827] p-10 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-black mb-4 text-white">Free</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Basic audit & core insights for quick checkups.
              </p>
              <div className="text-4xl font-black mb-8 text-white">$0</div>
              <button className="w-full border-2 border-gray-700 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all text-gray-300">
                Try Free
              </button>
            </div>

            <div className="bg-[#111827] p-10 rounded-2xl border-2 border-blue-500 relative scale-105 shadow-xl shadow-blue-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-1 rounded-full text-xs font-black uppercase">
                Most Popular
              </div>
              <h3 className="text-xl font-black mb-4 text-white">Pro</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Full audit report + step-by-step fix plan & code snippets.
              </p>
              <div className="text-4xl font-black mb-8 text-white">
                $19{" "}
                <span className="text-sm text-gray-400 font-normal">
                  / audit
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Coming Soon
              </button>
            </div>

            <div className="bg-[#0B0F1A] p-10 rounded-2xl border border-gray-700 text-white">
              <h3 className="text-xl font-black mb-4">Custom</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Full implemention & high-performance website build.</p>
              <div className="text-4xl font-black mb-8">Quote</div>
              <Link href="/contact" className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-center transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section
        id="content"
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8"
      >
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
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 7. EXPERT SERVICES (Conversion Zone) */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-12 md:p-24 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Too busy to fix it yourself?
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12">
              Our expert team builds high-performance, high-converting websites
              starting from scratch or optimizing your current stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="bg-white text-black px-10 py-5 rounded-xl font-black text-lg hover:bg-gray-100 transition-all">
                Custom Website Build
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 text-white px-10 py-5 rounded-xl font-black text-lg backdrop-blur-md transition-all">
                Consult With Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
