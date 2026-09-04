"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe, Loader2, Mail, Zap } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/app/components/SiteHeader";
import { authenticatedFetch } from "@/lib/authFetch";
import { useTranslation } from "@/lib/i18n";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function parseJsonSafe(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Checkout service is not available yet.");
  }
  return response.json();
}

export default function ProAuditPage() {
  const { language } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const copy = language === "zh" ? {
    back: "返回",
    title: "购买一次 Pro 审计，在报告生成后使用。",
    description: "一次购买可解锁一份完整 Pro 报告，包括详细 SEO + GEO 审计、检测证据和可执行修复计划。",
    benefits: ["一次性付款，无订阅", "详细 SEO 与 GEO 证据型审计", "优先级修复计划、实施步骤和代码示例"],
    credit: "一次性 Pro 审计额度",
    email: "用于保存 Pro 额度的邮箱",
    buy: "购买 Pro 审计",
    opening: "正在打开 Stripe...",
    invalidEmail: "请输入有效邮箱。",
    admin: "管理员账号已包含完整 Pro 权限，无需付款。",
    adminButton: "开始管理员 Pro 审计",
    adminConfirmed: "已确认管理员 Pro 权限。",
  } : {
    back: "Back",
    title: "Buy one Pro Audit now. Use it when your report is ready.",
    description: "One purchase unlocks one complete Pro report with detailed SEO + GEO evidence and an implementation-ready fix plan.",
    benefits: ["One-time payment, no subscription", "Detailed evidence-backed SEO and GEO audit", "Prioritized fix plan, implementation steps, and code examples"],
    credit: "one-time Pro Audit credit",
    email: "Email for your Pro credit",
    buy: "Buy Pro Audit",
    opening: "Opening Stripe...",
    invalidEmail: "Enter a valid email to continue.",
    admin: "Your administrator account already includes full Pro access. No payment is required.",
    adminButton: "Run an Admin Pro Audit",
    adminConfirmed: "Administrator Pro access confirmed.",
  };

  useEffect(() => {
    void authenticatedFetch("/api/auth/me")
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        setIsAdmin(Boolean(result?.isAdmin));
        if (result?.email) setEmail(result.email);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isAdmin && !validEmail) {
      toast.error(copy.invalidEmail);
      return;
    }

    try {
      setLoading(true);
      const response = await authenticatedFetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email.trim(),
          purchaseType: "pro_credit",
        }),
      });
      const result = await parseJsonSafe(response);
      if (!response.ok) {
        throw new Error(result.error || "Failed to start checkout.");
      }
      if (result.adminUnlocked) {
        toast.success(copy.adminConfirmed);
        window.location.assign(result.url || "/");
        return;
      }
      if (!result.url) throw new Error("Stripe checkout URL missing.");
      window.location.assign(result.url);
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Unable to open checkout."));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <SiteHeader />
      <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <section>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-teal-200">
              <Zap className="h-4 w-4" />
              SiteScope Pro Audit
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              {isAdmin ? copy.admin : copy.description}
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-gray-300">
              {copy.benefits.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-300" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-[#111827] p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="flex items-end justify-center gap-3">
                <span className="text-5xl font-black">$9</span>
                <span className="pb-2 text-lg font-bold text-gray-500 line-through">
                  $29
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-teal-300">
                {copy.credit}
              </p>
            </div>

            <form onSubmit={handleCheckout}>
              <label className="mb-2 block text-sm font-bold text-white">
                {copy.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F1A] py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required={!isAdmin}
                  disabled={isAdmin}
                />
              </div>
              <button
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 py-3 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {copy.opening}
                  </>
                ) : (
                  <>
                    <Globe className="h-5 w-5" />
                    {isAdmin ? copy.adminButton : copy.buy}
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
      </div>
    </main>
  );
}
