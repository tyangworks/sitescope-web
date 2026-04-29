"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Globe, Calendar, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

// 初始化前端 Supabase (换成你自己的凭证)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, []);

  if (loading) return <div className="p-20 text-center">正在加载历史记录...</div>;

  return (
    <main className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">审计历史记录</h1>
            <p className="text-slate-500">查看所有已生成的网站分析报告</p>
          </div>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">
            新建分析
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              {/* 图片预览 */}
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img 
                  src={report.screenshot_url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="preview"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{report.score}</span>
                </div>
              </div>

              {/* 信息区 */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  <Globe className="w-3 h-3" />
                  <span className="truncate">{report.url}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-4 line-clamp-1">{report.summary}</h3>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  <Link href={`/report/${report.id}`} className="text-blue-600 font-bold text-sm flex items-center gap-1">
                    查看详情 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">暂无报告，快去分析第一个网站吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}