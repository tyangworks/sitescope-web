import Link from "next/link";
import { ConfirmedCheckoutEvent } from "@/app/components/GrowthTracking";
import { CheckCircle2, ArrowRight, AlertCircle, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

type FinalizePaymentResult = {
  reportId: string;
  isCreditPurchase: boolean;
  email: string;
};

async function finalizePayment(sessionId: string): Promise<FinalizePaymentResult> {
  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi"
  ).replace(/\/+$/, "");
  const response = await fetch(
    `${apiUrl}/api/finalize-checkout-session?session_id=${encodeURIComponent(
      sessionId,
    )}`,
    { cache: "no-store" },
  );
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    throw new Error(data?.error || "Could not verify payment.");
  }

  return {
    reportId: data.reportId || "",
    isCreditPurchase: Boolean(data.isCreditPurchase),
    email: data.email || "",
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let reportId = "";
  let customerEmail = "";
  let isCreditPurchase = false;
  let errorMessage = "";

  if (!sessionId) {
    errorMessage = "Missing Stripe session. Please return to your report.";
  } else {
    try {
      const result = await finalizePayment(sessionId);
      reportId = result.reportId;
      customerEmail = result.email;
      isCreditPurchase = result.isCreditPurchase;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Could not unlock your report.";
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] px-6 py-16 text-white">
      {!errorMessage && <ConfirmedCheckoutEvent />}
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black">SiteScope</span>
        </Link>

        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-2xl">
          {errorMessage ? (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
                <AlertCircle className="h-7 w-7 text-red-300" />
              </div>
              <h1 className="text-3xl font-black">Payment needs attention</h1>
              <p className="mt-4 leading-relaxed text-gray-300">{errorMessage}</p>
              <Link
                href="/reports"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-3 font-bold text-white transition-colors hover:border-teal-300"
              >
                Back to reports
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/15">
                <CheckCircle2 className="h-7 w-7 text-teal-300" />
              </div>
              <p className="text-sm font-black uppercase tracking-wide text-teal-300">
                Payment confirmed
              </p>
              <h1 className="mt-3 text-3xl font-black">
                {isCreditPurchase
                  ? "Your Pro Audit credit is ready"
                  : "Your Pro Audit is unlocked"}
              </h1>
              <p className="mt-4 leading-relaxed text-gray-300">
                {isCreditPurchase
                  ? `We saved one Pro Audit credit for ${customerEmail}. Run an audit, then use this email to unlock the full Pro report.`
                  : "The payment was verified with Stripe and your report is now marked as unlocked in SiteScope."}
              </p>
              <Link
                href={
                  isCreditPurchase ? "/" : `/report/${encodeURIComponent(reportId)}`
                }
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-3 font-black text-white transition-opacity hover:opacity-90"
              >
                {isCreditPurchase ? "Run your audit" : "View full report"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
