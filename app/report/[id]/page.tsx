"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Lightbulb, Camera, ArrowLeft, Share2, Globe } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReportDetail() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error) setReport(data);
      setLoading(false);
    }
    if (params.id) fetchReport();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center animate-pulse">正在调取分析档案...</div>;
  if (!report) return <div className="p-20 text-center">未找到该报告，可能已被删除。</div>;

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-20">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/reports" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回历史记录
          </Link>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("链接已复制到剪贴板！");
                }}
                className="flex items-center gap-2 text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
             >
                <Share2 className="w-4 h-4" /> 分享报告
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Site Report</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 truncate max-w-xl">{report.url}</h1>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 text-xs font-bold block uppercase mb-1">Generated on</span>
                <span className="font-bold text-slate-700">{new Date(report.created_at).toLocaleDateString()}</span>
            </div>
        </div>

        {/* 报告核心内容卡片 (复用之前的 UI 逻辑) */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-2 bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="rounded-xl overflow-hidden aspect-video bg-slate-50 relative border border-slate-100">
                    <img src={report.screenshot_url} alt="Site preview" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-lg">
                <div className="text-6xl font-black mb-4">{report.score}</div>
                <h3 className="text-xl font-bold mb-2">综合得分</h3>
                <p className="text-blue-100 text-sm">{report.summary}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-5 h-5" /> 审计发现的问题
                </h3>
                {report.seo_issues.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-800">{item.issue}</h4>
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">{item.impact}</span>
                        </div>
                        <p className="text-sm text-slate-500"><span className="text-green-600 font-bold">建议修复:</span> {item.fix}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Lightbulb className="text-amber-500 w-5 h-5" /> 增长与转化建议
                </h3>
                {report.content_suggestions.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">{item.area}</h4>
                        <p className="text-sm text-slate-500">{item.suggestion}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}