"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, CheckCircle2, Lightbulb, Globe, ArrowRight, Camera } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [reportData, setReportData] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadingMessages = [
    "🚀 正在启动云端无头浏览器...",
    "📸 正在捕捉网页实时快照...",
    "🧠 Gemini AI 正在进行深度审计...",
    "📊 正在生成可视化增长报告...",
  ];

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
    setReportData(null);
    setScreenshot(null);

    try {
      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setReportData(data.report);
      setScreenshot(data.screenshot); // 存入截图
    } catch (err: any) {
      setError(err.message || "连接服务器失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900 pb-20">
      {/* 极简导航 */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SiteScope AI</span>
          </div>
          <button className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">登录控制台</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
            让你的网站 <span className="text-blue-600">更懂搜索</span>
          </h1>
          <p className="text-lg text-slate-500">
            SiteScope 结合 Gemini 2.0 深度审计技术，为您提供即时、可落地的网站优化建议。
          </p>
        </div>

        {/* 搜索组件 */}
        <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto mb-16">
          <div className="flex items-center p-2 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入网址，例如: https://example.com"
              className="flex-1 bg-transparent px-4 py-3 outline-none text-lg"
              disabled={loading}
            />
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "开始免费审计"}
            </button>
          </div>
          {error && <p className="absolute -bottom-8 left-4 text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
        </form>

        {/* Loading 动画 */}
        {loading && (
          <div className="py-20 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl font-medium text-slate-700 animate-pulse">{loadingMessages[loadingStep]}</p>
          </div>
        )}

        {/* 报告内容区 */}
        {reportData && !loading && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* 第一排：截图 + 分数概览 */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* 截图卡片 */}
              <div className="md:col-span-2 bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Snapshot</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 aspect-video relative">
                  {screenshot && <img src={screenshot} alt="Screenshot" className="w-full h-full object-cover" />}
                </div>
              </div>

              {/* 环形分数卡片 */}
              <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-blue-200">
                <div className="relative mb-6">
                  <svg className="w-32 h-32">
                    <circle className="text-blue-400/30" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                    <circle 
                      className="text-white transition-all duration-1000 ease-out" 
                      strokeWidth="8" 
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * reportData.score) / 100}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="58" cx="64" cy="64" 
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-black">{reportData.score}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">综合健康度</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{reportData.summary}</p>
              </div>
            </div>

            {/* 第二排：核心问题审计 (左右分栏) */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* 问题列 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <AlertCircle className="text-red-500 w-5 h-5" /> 需要关注的风险
                </h3>
                {reportData.seoIssues.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-800">{item.issue}</h4>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                        item.impact === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.impact}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-700 font-semibold flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> 修复方案:
                      </strong>
                      {item.fix}
                    </div>
                  </div>
                ))}
              </div>

              {/* 增长建议列 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <Lightbulb className="text-amber-500 w-5 h-5" /> 增长优化点
                </h3>
                {reportData.contentSuggestions.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
                    <h4 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{item.area}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部 CTA：转化增值服务 */}
            <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2">需要专家帮您执行这些方案？</h3>
                <p className="text-slate-400">我们的增长顾问可以协助您完成代码修改、SEO 优化和内容营销。</p>
              </div>
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 whitespace-nowrap">
                预约免费咨询 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}