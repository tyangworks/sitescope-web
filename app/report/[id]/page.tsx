"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  ExternalLink,
  Share2,
  Globe,
  Lock,
  Coffee,
  Heart,
  Trash2,
  CheckCircle2,
  Loader2,
  Zap,
  Code,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const paypalDonateUrl =
  "https://www.paypal.com/donate/?hosted_button_id=DMPQU9NWDQDYE";

// Type definitions
type ReportIssue = {
  issue: string;
  impact: string;
  fix: string;
};

type ReportSuggestion = {
  area: string;
  suggestion: string;
};

type FixPlan = {
  step: number;
  action: string;
  code_snippet?: string;
  priority: "high" | "medium" | "low";
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
  fix_plans?: FixPlan[] | null;
};

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function ReportDetail() {
  const params = useParams();
  const { t } = useTranslation();
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";
  const reportId = String(params.id || "");
  const isLocked = report ? !report.is_paid : false;

  // Tier 1: Free - Top 3 issues
  const freeIssues = report?.seo_issues?.slice(0, 3) || [];
  // Tier 2: Email unlock - Remaining issues
  const lockedIssues = report?.seo_issues?.slice(3) || [];
  // Tier 3: Pro - Fix plans and code snippets
  const fixPlans = report?.fix_plans || [];

  const loadingSteps = [
    { icon: <Globe className="w-5 h-5" />, text: "Fetching site structure" },
    { icon: <Zap className="w-5 h-5" />, text: "Running performance tests" },
    { icon: <AlertCircle className="w-5 h-5" />, text: "Checking SEO signals" },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: "Generating AI insights...",
    },
  ];

  async function parseJsonSafe(response: Response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Server communication error. Please try again.");
    }
    return response.json();
  }

  const fetchReport = useCallback(async () => {
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
  }, [reportId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchReport();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchReport]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const localAdminKey = window.localStorage.getItem("admin_key");
      setIsAdmin(Boolean(localAdminKey));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleEmailUnlock() {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      // Store email in Supabase for marketing
      const { error } = await supabase.from("email_unlocks").insert([
        {
          report_id: reportId,
          email: email.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setEmailSubmitted(true);
      toast.success("Email submitted! Full report unlocked.");
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Failed to submit email."));
    }
  }

  async function handleProUnlock() {
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
      const redeemResponse = await fetch("/api/redeem-pro-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          email: email.trim(),
        }),
      });
      const redeemResult = await parseJsonSafe(redeemResponse);

      if (redeemResponse.ok && redeemResult.success) {
        await fetchReport();
        toast.success("Pro Audit credit applied. Report unlocked.");
        setUnlocking(false);
        return;
      }

      if (redeemResponse.status !== 404) {
        throw new Error(redeemResult.error || "Failed to check Pro Audit credit.");
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          customerEmail: email.trim(),
          purchaseType: "report_unlock",
        }),
      });
      const result = await parseJsonSafe(response);
      if (!response.ok) {
        throw new Error(result.error || "Failed to start checkout.");
      }
      if (result.alreadyPaid) {
        window.location.href = result.url || `/report/${reportId}`;
        return;
      }
      if (!result.url) throw new Error("Stripe checkout URL missing.");
      window.location.href = result.url;
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Unable to open checkout."));
      setUnlocking(false);
    }
  }

  async function handleDeleteReport() {
    const localAdminKey = window.localStorage.getItem("admin_key");
    if (!localAdminKey) {
      toast.error("Admin key missing.");
      return;
    }
    if (!reportId) return;
    if (!window.confirm("Delete this report permanently?")) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `${apiUrl}/api/report/${encodeURIComponent(reportId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": localAdminKey,
          },
        },
      );
      const result = await parseJsonSafe(response);
      if (!response.ok) throw new Error(result.error || "Delete failed");
      toast.success("Report deleted.");
      window.location.href = "/reports";
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Failed to delete report."));
    } finally {
      setDeleting(false);
    }
  }

  // Loading state with step progress
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 mx-auto text-[#3A8DFF] animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Analyzing Your Website
          </h2>
          <p className="text-[#9CA3AF] mb-8">
            Estimated time: 20-30 seconds. Real value takes time.
          </p>

          <div className="space-y-4">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  index === loadingStep
                    ? "bg-[#111827] border border-[#3A8DFF] pulse-glow"
                    : index < loadingStep
                      ? "bg-[#111827] border border-[#00C2A8]"
                      : "bg-[#111827] border border-[#1F2937] opacity-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    index === loadingStep
                      ? "text-[#3A8DFF]"
                      : index < loadingStep
                        ? "text-[#00C2A8]"
                        : "text-[#6B7280]"
                  }`}
                >
                  {index < loadingStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index === loadingStep
                      ? "text-white"
                      : index < loadingStep
                        ? "text-[#00C2A8]"
                        : "text-[#6B7280]"
                  }`}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full h-2 bg-[#111827] rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg transition-all duration-500"
              style={{
                width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Report Not Found
          </h2>
          <p className="text-[#9CA3AF] mb-6">
            This report may have been deleted or does not exist.
          </p>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
        </div>
      </main>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] pb-20">
      {/* Navigation */}
      <nav className="bg-[#0B0F1A]/80 backdrop-blur-md border-b border-[#1F2937] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/reports"
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Reports</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={handleDeleteReport}
                disabled={deleting}
                className="flex items-center gap-2 text-sm font-bold bg-red-500/10 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500/20 disabled:opacity-60 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : "Delete Report"}
              </button>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Share link copied to clipboard!");
              }}
              className="flex items-center gap-2 text-sm font-bold bg-[#111827] text-white px-4 py-2 rounded-xl border border-[#1F2937] hover:border-[#3A8DFF] transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#3A8DFF] mb-3">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Site Report
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
              {report.url}
            </h1>
            <p className="text-[#9CA3AF]">
              Generated on {new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-[#111827] px-8 py-6 rounded-2xl border border-[#1F2937] shadow-xl">
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#1F2937"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(report.score / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3A8DFF" />
                      <stop offset="100%" stopColor="#00C2A8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {report.score}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#6B7280] uppercase mb-1">
                  Overall Score
                </div>
                <div
                  className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(report.score)} bg-clip-text text-transparent`}
                >
                  {getScoreLabel(report.score)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot and Summary */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#111827] rounded-2xl p-4 border border-[#1F2937] shadow-xl">
            <div className="rounded-xl overflow-hidden aspect-video bg-[#0B0F1A] relative border border-[#1F2937]">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[#111827]" />
              )}
              <img
                src={report.screenshot_url}
                alt="Site preview"
                className="w-full h-full object-contain"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#3A8DFF] to-[#00C2A8] rounded-2xl p-8 text-white shadow-xl">
            <div className="text-5xl font-black mb-4">{report.score}</div>
            <h3 className="text-xl font-bold mb-2">综合得分</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>

        {/* Tier 1: Free - Top 3 Issues */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                核心问题 (免费预览)
              </h2>
              <p className="text-[#9CA3AF] text-sm">前3个最关键的问题</p>
            </div>
          </div>

          <div className="space-y-4">
            {freeIssues.map((item: ReportIssue, i: number) => (
              <div
                key={`free-${i}`}
                className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] shadow-lg hover:border-[#3A8DFF]/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{item.issue}</h4>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.impact === "High"
                        ? "bg-red-500/20 text-red-400"
                        : item.impact === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#9CA3AF]">
                    <span className="text-green-400 font-semibold">影响:</span>{" "}
                    {item.impact}
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    <span className="text-[#3A8DFF] font-semibold">
                      建议修复:
                    </span>{" "}
                    {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Email Unlock - Remaining Issues */}
        <div className="mb-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3A8DFF]/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#3A8DFF]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                更多问题 (邮箱解锁)
              </h2>
              <p className="text-[#9CA3AF] text-sm">输入邮箱解锁完整问题列表</p>
            </div>
          </div>

          {!emailSubmitted && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-[#0B0F1A]/80 backdrop-blur-md flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-[#111827] rounded-2xl border border-[#1F2937] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-[#3A8DFF]" />
                  <h3 className="text-xl font-bold text-white">解锁完整报告</h3>
                </div>
                <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
                  输入您的邮箱地址即可免费解锁所有SEO问题的详细分析。
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                />
                <button
                  onClick={handleEmailUnlock}
                  className="w-full gradient-bg text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  免费解锁完整报告
                </button>
                <p className="text-xs text-[#6B7280] mt-4 text-center">
                  我们尊重您的隐私，不会发送垃圾邮件
                </p>
              </div>
            </div>
          )}

          <div
            className={`grid md:grid-cols-2 gap-6 ${!emailSubmitted ? "blur-sm pointer-events-none select-none" : ""}`}
          >
            {lockedIssues.map((item: ReportIssue, i: number) => (
              <div
                key={i}
                className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] shadow-lg hover:border-[#3A8DFF]/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{item.issue}</h4>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.impact === "High"
                        ? "bg-red-500/20 text-red-400"
                        : item.impact === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#9CA3AF]">
                    <span className="text-green-400 font-semibold">影响:</span>{" "}
                    {item.impact}
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    <span className="text-[#3A8DFF] font-semibold">
                      建议修复:
                    </span>{" "}
                    {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Pro - Fix Plans and Code Snippets */}
        <div className="mb-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/20 flex items-center justify-center">
              <Code className="w-5 h-5 text-[#00C2A8]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                修复计划 (Pro专享)
              </h2>
              <p className="text-[#9CA3AF] text-sm">详细的修复步骤和代码片段</p>
            </div>
          </div>

          {!report.is_paid && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-[#0B0F1A]/80 backdrop-blur-md flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-[#111827] rounded-2xl border border-[#1F2937] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-[#00C2A8]" />
                  <h3 className="text-xl font-bold text-white">
                    Unlock Pro Audit
                  </h3>
                </div>
                <p className="text-sm text-[#9CA3AF] mb-5 leading-relaxed">
                  Unlock the full audit report, prioritized fix plan, and
                  implementation-ready insights.
                </p>
                <div className="mb-5 flex items-end gap-3">
                  <div className="text-4xl font-black text-white">$9</div>
                  <div className="pb-1 text-sm font-bold text-[#6B7280]">
                    <span className="line-through">$29</span>
                    <span className="ml-2 text-[#00C2A8]">one-time</span>
                  </div>
                </div>
                <div className="bg-[#0B0F1A] rounded-xl p-4 mb-6 border border-[#1F2937]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                    <span className="text-sm text-white">Detailed fix steps</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                    <span className="text-sm text-white">Ready-to-use code snippets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                    <span className="text-sm text-white">Priority-ranked action plan</span>
                  </div>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                />
                <button
                  onClick={handleProUnlock}
                  disabled={unlocking}
                  className="w-full gradient-bg text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {unlocking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Unlock Pro Audit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div
            className={`space-y-6 ${!report.is_paid ? "blur-sm pointer-events-none select-none" : ""}`}
          >
            {fixPlans.map((plan: FixPlan, i: number) => (
              <div
                key={i}
                className="bg-[#111827] rounded-2xl border border-[#1F2937] shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        plan.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : plan.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      <span className="font-bold text-sm">{plan.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2">
                        {plan.action}
                      </h4>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          plan.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : plan.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {plan.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  {plan.code_snippet && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-[#3A8DFF]" />
                        <span className="text-sm font-semibold text-[#3A8DFF]">
                          代码片段
                        </span>
                      </div>
                      <pre className="bg-[#0B0F1A] rounded-xl p-4 overflow-x-auto border border-[#1F2937]">
                        <code className="text-sm text-[#9CA3AF] font-mono">
                          {plan.code_snippet}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Suggestions */}
        {report.content_suggestions &&
          report.content_suggestions.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#00C2A8]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">内容建议</h2>
                  <p className="text-[#9CA3AF] text-sm">提升用户体验的建议</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {(report.content_suggestions || []).map(
                  (item: ReportSuggestion, i: number) => (
                    <div
                      key={i}
                      className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] shadow-lg hover:border-[#00C2A8]/50 transition-all"
                    >
                      <h4 className="font-bold text-white text-lg mb-3">
                        {item.area}
                      </h4>
                      <p className="text-sm text-[#9CA3AF] leading-relaxed">
                        {item.suggestion}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Donation Section */}
        <div className="overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-[#111827] to-[#0B0F1A] shadow-xl">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
                <Heart className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {t.report.supportUs}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]">
                  {t.report.supportUsSubtitle}
                </p>
              </div>
            </div>
            <a
              href={paypalDonateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffc439] px-6 py-3 text-sm font-black text-[#003087] transition-all hover:scale-[1.01] hover:opacity-95"
            >
              <Coffee className="h-5 w-5" />
              {t.report.donate}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
