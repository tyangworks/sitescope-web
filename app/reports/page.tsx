"use client";

import { useEffect, useState } from "react";
import { Globe, Calendar, ArrowRight, Star, Plus, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authenticatedFetch } from "@/lib/authFetch";
import { useTranslation } from "@/lib/i18n";

type Report = {
  id: string;
  url: string;
  score: number;
  screenshot_url: string;
  created_at: string;
  summary: string;
};

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  async function handleLogout() {
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await authenticatedFetch("/api/reports");
        if (response.status === 401) {
          setAuthRequired(true);
          return;
        }
        if (!response.ok) throw new Error("Failed to load reports.");
        const data = await response.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-[#3A8DFF] animate-spin mb-4" />
          <p className="text-[#9CA3AF]">{t.common.loading}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A]">
      {/* Navigation - 修复显示问题 */}
      <nav className="bg-[#0B0F1A] border-b border-[#1F2937] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#3A8DFF] to-[#00C2A8] rounded-lg flex items-center justify-center">
              <Globe className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-white">SiteScope</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-[#111827] rounded-lg p-1 border border-[#1F2937]">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === "en"
                    ? "bg-[#3A8DFF] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("zh")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === "zh"
                    ? "bg-[#3A8DFF] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                中
              </button>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              {t.reports.newAnalysis}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1F2937] text-[#9CA3AF] transition-colors hover:border-[#3A8DFF] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-3">
            {t.reports.title}
          </h1>
          <p className="text-[#9CA3AF] text-lg">{t.reports.subtitle}</p>
        </div>

        {/* Reports Grid */}
        {authRequired ? (
          <div className="border-2 border-dashed border-[#1F2937] bg-[#111827] py-20 text-center">
            <Globe className="mx-auto mb-6 h-12 w-12 text-[#6B7280]" />
            <h3 className="mb-3 text-xl font-bold text-white">Sign in to view saved reports</h3>
            <p className="mx-auto mb-6 max-w-md text-[#9CA3AF]">
              Your report history is private and only available to your account.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white gradient-bg">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="group bg-[#111827] rounded-2xl overflow-hidden border border-[#1F2937] shadow-lg hover:border-[#3A8DFF]/50 transition-all"
              >
                {/* Screenshot */}
                <div className="aspect-video bg-[#0B0F1A] relative overflow-hidden">
                  <Image
                    src={report.screenshot_url}
                    alt="Site preview"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#111827]/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 border border-[#1F2937]">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">
                      {report.score}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-3">
                    <Globe className="w-3 h-3" />
                    <span className="truncate">{report.url}</span>
                  </div>

                  <h3 className="font-bold text-white mb-4 line-clamp-2">
                    {report.summary}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
                    <div className="flex items-center gap-1 text-[#6B7280] text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-[#3A8DFF] font-semibold text-sm group-hover:gap-2 transition-all">
                      {t.reports.viewDetails}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-[#111827] rounded-3xl border-2 border-dashed border-[#1F2937]">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#1F2937] rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-[#6B7280]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {t.reports.noReports}
            </h3>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all mt-4"
            >
              <Plus className="w-5 h-5" />
              {t.reports.newAnalysis}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
