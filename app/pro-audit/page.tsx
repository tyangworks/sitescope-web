"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe, Loader2, Mail, Zap } from "lucide-react";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      toast.error("Enter a valid email to continue.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/create-checkout-session", {
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
      if (!result.url) throw new Error("Stripe checkout URL missing.");
      window.location.href = result.url;
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Unable to open checkout."));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <section>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-teal-200">
              <Zap className="h-4 w-4" />
              SiteScope Pro Audit
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Buy one Pro Audit now. Use it when your report is ready.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Your purchase is saved as one Pro Audit credit for your email.
              After you run any audit, enter the same email to unlock the full
              Pro report instantly.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-gray-300">
              {[
                "One-time payment, no subscription",
                "Works for one full Pro report unlock",
                "Stored by email so you can use it later",
              ].map((item) => (
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
                one-time Pro Audit credit
              </p>
            </div>

            <form onSubmit={handleCheckout}>
              <label className="mb-2 block text-sm font-bold text-white">
                Email for your Pro credit
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F1A] py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                />
              </div>
              <button
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 py-3 font-black text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Opening Stripe...
                  </>
                ) : (
                  <>
                    <Globe className="h-5 w-5" />
                    Buy Pro Audit
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
