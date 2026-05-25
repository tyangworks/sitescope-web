"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, Globe, Zap, ShieldCheck, TrendingUp, ArrowRight, MousePointer2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const loadingMessages = [
    "🚀 正在调度云端浏览器...",
    "📸 捕获高清视觉快照...",
    "🧠 AI 专家正在审计 SEO 结构...",
    "📊 整合增长优化建议..."
  ];

  // 1. 获取最近的 3 条分析记录作为“实时案例”
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
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";
      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // 分析完成后直接跳转到详情页
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      setError(err.message || "连接服务器失败");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      
      {/* 1. 简洁导航栏 */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter">SiteScope AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <Link href="/reports" className="hover:text-blue-600 transition-colors">历史记录</Link>
          <a href="#services" className="hover:text-blue-600 transition-colors">建站服务</a>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all">
            开始免费审计
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-blue-100">
            <Zap className="w-4 h-4" /> Powered by Gemini 2.0 Flash
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            让您的网站不仅被看到 <br />
            <span className="text-blue-600 italic">更被信任</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 font-medium">
            我们不仅仅提供 SEO 审计。SiteScope 通过 AI 深度理解您的业务，为您提供从加载速度到转化路径的完整优化方案。
          </p>

          {/* 核心搜索框 */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleAnalyze} className="relative flex flex-col md:flex-row items-center gap-4 p-2 bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
              <div className="flex-1 flex items-center pl-4 w-full">
                <MousePointer2 className="text-slate-300 w-6 h-6 mr-3" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="输入您的网址，如 https://yoursite.com"
                  className="w-full py-4 bg-transparent text-lg outline-none font-medium"
                  disabled={loading}
                />
              </div>
              <button
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "立即生成 AI 审计报告"}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 font-bold flex items-center justify-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>

          {loading && (
            <div className="mt-12 flex flex-col items-center animate-in fade-in duration-500">
              <div className="text-xl font-bold text-blue-600 mb-4">{loadingMessages[loadingStep]}</div>
              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-[loading_12s_ease-in-out_infinite]" style={{width: '60%'}}></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. 最近审计展示 (Social Proof) */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2">最近的审计动态</h2>
              <p className="text-slate-500 font-medium">全球开发者正在使用 SiteScope 优化他们的数字化资产</p>
            </div>
            <Link href="/reports" className="flex items-center gap-2 font-bold text-blue-600 hover:gap-3 transition-all">
              查看全部历史报告 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentReports.map((report) => (
              <Link href={`/report/${report.id}`} key={report.id} className="group bg-white rounded-3xl p-4 border border-slate-200 hover:shadow-xl transition-all">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-50">
                  <img src={report.screenshot_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="site" />
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-bold text-slate-400 truncate max-w-[150px]">{report.url}</span>
                  <div className="flex items-center gap-1 text-green-600 font-black">
                    <Zap className="w-4 h-4 fill-green-600" /> {report.score}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 核心优势 */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">风险识别</h3>
            <p className="text-slate-500 leading-relaxed font-medium">自动识别死链、错误的标题层级以及会降低搜索引擎权重的技术性错误。</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">性能飞跃</h3>
            <p className="text-slate-500 leading-relaxed font-medium">针对移动端和桌面端的加载速度进行深度剖析，提供具体的图片和脚本压缩方案。</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">转化导向</h3>
            <p className="text-slate-500 leading-relaxed font-medium">不仅仅是技术分析，AI 还会从营销角度评估您的 CTA 按钮和文案是否具有说服力。</p>
          </div>
        </div>
      </section>

      {/* 5. 服务入口 (变现区) */}
      <section id="services" className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">觉得这些修复方案太复杂？<br /><span className="text-blue-400">让我们来帮您搞定。</span></h2>
              <p className="text-slate-400 text-lg mb-10 font-medium">
                我们的专家团队提供端到端的优化实施服务。从修复 SEO 错误到重新设计高性能的响应式网站，我们全权负责。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all">
                  咨询网站定制
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-2xl font-black transition-all">
                  人工性能优化
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-black mb-1">24h</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">快速交付</div>
               </div>
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-black mb-1">99+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">性能评分</div>
               </div>
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-black mb-1">SEO</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">完全托管</div>
               </div>
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div className="text-3xl font-black mb-1">AI</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">持续优化</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm font-bold">
        © 2026 SiteScope AI. 专注于全球网站增长与性能优化。
      </footer>

    </main>
  );
}