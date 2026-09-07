"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, LogOut, Plus, ShieldCheck, Sparkles } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { authenticatedFetch } from "@/lib/authFetch";
import { useTranslation } from "@/lib/i18n";

type AccountState = {
  authenticated: boolean;
  email: string | null;
  isAdmin: boolean;
};

type ReportSummary = {
  id: string;
  url: string;
  score: number;
  created_at: string;
  access_level?: string;
};

export default function AccountDashboard() {
  const { language } = useTranslation();
  const [account, setAccount] = useState<AccountState | null>(null);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const zh = language === "zh";

  useEffect(() => {
    let active = true;
    Promise.all([
      authenticatedFetch("/api/auth/me"),
      authenticatedFetch("/api/reports"),
    ])
      .then(async ([accountResponse, reportsResponse]) => {
        const accountData = accountResponse.ok ? await accountResponse.json() : null;
        const reportsData = reportsResponse.ok ? await reportsResponse.json() : { reports: [] };
        if (!active) return;
        setAccount(accountData);
        setReports(Array.isArray(reportsData.reports) ? reportsData.reports : []);
      })
      .catch(() => {
        if (active) setAccount(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const proCount = useMemo(
    () => reports.filter((report) => report.access_level === "pro").length,
    [reports],
  );
  const latestReport = reports[0];

  async function handleLogout() {
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-white">
        <SiteHeader />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-32 text-[#9CA3AF]">
          {zh ? "正在加载账户..." : "Loading your account..."}
        </div>
      </main>
    );
  }

  if (!account?.authenticated) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-white">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <ShieldCheck className="mx-auto mb-5 h-12 w-12 text-[#3A8DFF]" />
          <h1 className="mb-3 text-3xl font-black">{zh ? "登录你的账户" : "Sign in to your account"}</h1>
          <p className="mb-8 text-[#9CA3AF]">
            {zh ? "登录后可以查看历史报告、保存审计并管理你的账户。" : "Sign in to view report history, save audits, and manage your account."}
          </p>
          <Link href="/login?next=%2Faccount" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white gradient-bg">
            {zh ? "登录" : "Sign in"}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#00C2A8]">
              {zh ? "账户中心" : "Account dashboard"}
            </p>
            <h1 className="text-4xl font-black">{zh ? "欢迎回来" : "Welcome back"}</h1>
            <p className="mt-3 text-[#9CA3AF]">{account.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#audit" className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white gradient-bg">
              <Plus className="h-4 w-4" />{zh ? "新建审计" : "New audit"}
            </Link>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] px-4 py-2 font-semibold text-[#D1D5DB] hover:border-[#3A8DFF] hover:text-white">
              <LogOut className="h-4 w-4" />{zh ? "退出登录" : "Sign out"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5">
            <FileText className="mb-4 h-5 w-5 text-[#3A8DFF]" />
            <p className="text-sm text-[#9CA3AF]">{zh ? "历史报告" : "Saved reports"}</p>
            <p className="mt-2 text-3xl font-black">{reports.length}</p>
          </div>
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5">
            <Sparkles className="mb-4 h-5 w-5 text-[#00C2A8]" />
            <p className="text-sm text-[#9CA3AF]">{zh ? "Pro 报告" : "Pro reports"}</p>
            <p className="mt-2 text-3xl font-black">{proCount}</p>
          </div>
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5">
            <BarChart3 className="mb-4 h-5 w-5 text-yellow-400" />
            <p className="text-sm text-[#9CA3AF]">{zh ? "最近得分" : "Latest score"}</p>
            <p className="mt-2 text-3xl font-black">{latestReport ? latestReport.score : "--"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">{zh ? "管理你的审计" : "Manage your audits"}</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">{zh ? "从这里查看已保存的报告，或开始一次新的分析。" : "Review saved reports or start a new website analysis from here."}</p>
          </div>
          <Link href="/reports" className="inline-flex items-center gap-2 font-semibold text-[#60A5FA] hover:text-white">
            {zh ? "查看全部历史报告" : "View report history"}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {account.isAdmin && (
          <div className="mt-5 rounded-xl border border-[#00C2A8]/30 bg-[#00C2A8]/5 px-5 py-4 text-sm text-[#9FE9DF]">
            {zh ? "管理员账户：你拥有完整报告查看和维护权限。" : "Administrator account: full report access and maintenance tools are enabled."}
          </div>
        )}
      </div>
    </main>
  );
}
