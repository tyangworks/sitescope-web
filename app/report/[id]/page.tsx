"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useSearchParams } from "next/navigation";
import { AlertCircle, Lightbulb, ArrowLeft, Share2, Globe, Lock, Coffee } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ReportIssue = {
  issue: string;
  impact: string;
  fix: string;
};

type ReportSuggestion = {
  area: string;
  suggestion: string;
};

type ReportRecord = {
  id: string;
  url: string;
  created_at: string;
  score: number;
  summary: string;
  screenshot_url: string;
  is_paid: boolean;
  seo_issues: ReportIssue[] | null;
  content_suggestions: ReportSuggestion[] | null;
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function ReportDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";
  const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_ME_URL;
  const reportId = String(params.id || "");
  const isLocked = report ? !report.is_paid : false;

  async function fetchReport() {
    if (!reportId) return;
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();
      if (error) throw error;
      setReport(data as ReportRecord);
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Failed to load report."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  useEffect(() => {
    if (!searchParams || !reportId || !apiUrl) return;
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (canceled === "true") {
      toast.message("Checkout was canceled.");
    }

    if (success !== "true") return;

    let tries = 0;
    const maxTries = 90;
    const poll = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/report-payment-status?id=${encodeURIComponent(reportId)}`
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Polling failed");

        if (result.isPaid) {
          await fetchReport();
          toast.success("Payment confirmed. Report unlocked.");
          return true;
        }
      } catch (error: unknown) {
        if (tries === 0) {
          toast.error(errorMessage(error, "Could not verify payment yet."));
        }
      }
      return false;
    };

    const timer = setInterval(async () => {
      tries += 1;
      const done = await poll();
      if (done || tries >= maxTries) {
        clearInterval(timer);
        if (!done) {
          toast.message("Still processing payment. Please refresh in a moment.");
        }
      }
    }, 2000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, reportId, apiUrl]);

  async function handleUnlock() {
    if (!apiUrl) {
      toast.error("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }
    if (!reportId) {
      toast.error("Invalid report id.");
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      toast.error("Enter a valid email to continue.");
      return;
    }

    try {
      setUnlocking(true);
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          customerEmail: email.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to start checkout.");
      }
      if (!result.url) throw new Error("Stripe checkout URL missing.");
      window.location.href = result.url;
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Unable to open checkout."));
      setUnlocking(false);
    }
  }

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
                toast.success("Share link copied.");
              }}
              className="flex items-center gap-2 text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
            >
              <Share2 className="w-4 h-4" /> Share report
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
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 mb-8 grid md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-400 uppercase text-xs font-semibold mb-1">Report ID</p>
            <p className="font-semibold text-slate-700 break-all">{report.id}</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase text-xs font-semibold mb-1">Timestamp</p>
            <p className="font-semibold text-slate-700">{new Date(report.created_at).toISOString()}</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase text-xs font-semibold mb-1">Analyzed URL</p>
            <p className="font-semibold text-slate-700 break-all">{report.url}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-2 bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
                <div className="rounded-xl overflow-hidden aspect-video bg-slate-50 relative border border-slate-100 grid place-items-center">
                    {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-100" />}
                    <img
                      src={report.screenshot_url}
                      alt="Site preview"
                      className="w-full h-full max-h-[34rem] object-contain"
                      onLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-lg">
                <div className="text-6xl font-black mb-4">{report.score}</div>
                <h3 className="text-xl font-bold mb-2">综合得分</h3>
                <p className="text-blue-100 text-sm">{report.summary}</p>
            </div>
        </div>

        <div className="relative mb-8">
          {isLocked && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center px-6">
              <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
                <div className="flex items-center gap-2 text-slate-900 mb-3">
                  <Lock className="w-4 h-4" />
                  <h3 className="text-lg font-bold">Unlock full report - $19 CAD</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Enter your email to continue to Stripe checkout. This unlock uses SiteScope AI Engine.
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleUnlock}
                  disabled={unlocking}
                  className="w-full bg-blue-600 text-white font-semibold rounded-xl py-2.5 hover:bg-blue-700 disabled:opacity-60"
                >
                  {unlocking ? "Redirecting..." : "Proceed to payment"}
                </button>
              </div>
            </div>
          )}
        <div className={`grid md:grid-cols-2 gap-8 ${isLocked ? "blur-sm pointer-events-none select-none" : ""}`}>
            <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-5 h-5" /> 审计发现的问题
                </h3>
                {(report.seo_issues || []).map((item: ReportIssue, i: number) => (
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
                {(report.content_suggestions || []).map((item: ReportSuggestion, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">{item.area}</h4>
                        <p className="text-sm text-slate-500">{item.suggestion}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-10">
          <div className="flex items-start gap-3">
            <Coffee className="w-5 h-5 mt-0.5 text-amber-700" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Support us with a Coffee</h3>
              <p className="text-sm text-slate-600 mb-3">
                Donations help us improve SiteScope. This is optional and does not unlock reports.
              </p>
              <a
                href={paypalUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              >
                Donate via PayPal
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}