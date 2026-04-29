"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, Globe, Zap, ShieldCheck, TrendingUp, ArrowRight, CheckCircle2, MousePointer2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Supabase Connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadingMessages = [
    "🚀 Initializing cloud browser...",
    "📸 Capturing high-res visual snapshot...",
    "🧠 Analyzing SEO and structure...",
    "📊 Generating growth insights..."
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
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to report detail page
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Connection failed. Make sure the server is running.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SiteScope</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/reports" className="hover:text-black transition-colors">History</Link>
            <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
            <Link href="#services" className="hover:text-black transition-colors">Build</Link>
            <button className="bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-80 transition-all">
              Get Free Audit
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            See What’s Holding Your <br />
            <span className="text-blue-600">Growth Back</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 font-medium leading-relaxed">
            AI-powered website audits that show you exactly what to fix — and how to grow faster. 
            No sign-up required.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleAnalyze} className="relative flex flex-col md:flex-row items-center gap-4 p-2 bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
              <div className="flex-1 flex items-center pl-4 w-full">
                <MousePointer2 className="text-slate-300 w-6 h-6 mr-3" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL (e.g. https://site.com)"
                  className="w-full py-4 bg-transparent text-lg outline-none font-medium"
                  disabled={loading}
                />
              </div>
              <button
                disabled={loading}
                className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Get Free Audit"}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 font-bold flex items-center justify-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="mt-12 flex flex-col items-center">
              <div className="text-lg font-bold text-blue-600 mb-3">{loadingMessages[loadingStep]}</div>
              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-[pulse_2s_infinite]" style={{width: '70%'}}></div>
              </div>
            </div>
          )}
          
          <p className="mt-6 text-sm text-gray-400">Results in less than 60 seconds</p>
        </div>
      </section>

      {/* 3. RECENT AUDITS (Real Data) */}
      {recentReports.length > 0 && (
        <section className="bg-slate-50 py-20 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center mb-12">Recently Analyzed Sites</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentReports.map((report) => (
                <Link href={`/report/${report.id}`} key={report.id} className="group bg-white rounded-2xl p-3 border border-slate-200 hover:shadow-lg transition-all">
                  <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img src={report.screenshot_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="audit" />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">{report.url}</span>
                    <span className="text-xs font-black bg-blue-50 text-blue-600 px-2 py-1 rounded">Score: {report.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PAIN POINTS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Most websites don’t fail because of traffic.
          </h2>
          <p className="text-slate-500 text-lg mb-16">They fail because of hidden conversion killers.</p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-red-500 font-bold">!</div>
              <p className="font-bold text-slate-700">Slow performance that kills 50%+ of mobile conversions.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-red-500 font-bold">!</div>
              <p className="font-bold text-slate-700">SEO gaps blocking your business from organic growth.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-red-500 font-bold">!</div>
              <p className="font-bold text-slate-700">Generic content that fails to engage and convert visitors.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-red-500 font-bold">!</div>
              <p className="font-bold text-slate-700">Weak Call-to-Action and confusing user journeys.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
              <h3 className="text-xl font-black mb-4">Free</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Basic audit & core insights for quick checkups.</p>
              <div className="text-4xl font-black mb-8">$0</div>
              <button className="w-full border-2 border-slate-100 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all">Try Free</button>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border-4 border-blue-600 relative scale-105 shadow-xl shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase">Most Popular</div>
              <h3 className="text-xl font-black mb-4">Pro</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Full audit report + step-by-step fix plan & code snippets.</p>
              <div className="text-4xl font-black mb-8">$19 <span className="text-sm text-slate-400 font-normal">/ audit</span></div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">Coming Soon</button>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-black mb-4">Custom</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">Full implemention & high-performance website build.</p>
              <div className="text-4xl font-black mb-8">Quote</div>
              <Link href="#services" className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl font-bold text-center transition-all">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPERT SERVICES (Conversion Zone) */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-black rounded-[3.5rem] p-12 md:p-24 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Too busy to fix it yourself?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
              Our expert team builds high-performance, high-converting websites starting from scratch or optimizing your current stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all">
                Custom Website Build
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg backdrop-blur-md transition-all">
                Consult With Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">SS</div>
          <span className="font-bold text-sm uppercase tracking-widest">SiteScope</span>
        </div>
        <p className="text-slate-400 text-xs font-bold">© 2026 SiteScope AI. No data tracking. Just growth.</p>
      </footer>

    </main>
  );
}