import Link from "next/link";
import { ArrowLeft, CreditCard, Globe } from "lucide-react";

type CancelPageProps = {
  searchParams: Promise<{ report_id?: string }>;
};

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { report_id: reportId } = await searchParams;
  const reportHref = reportId ? `/report/${encodeURIComponent(reportId)}` : "/reports";

  return (
    <main className="min-h-screen bg-[#0B0F1A] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black">SiteScope</span>
        </Link>

        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-2xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
            <CreditCard className="h-7 w-7 text-blue-300" />
          </div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-300">
            Checkout canceled
          </p>
          <h1 className="mt-3 text-3xl font-black">No payment was made</h1>
          <p className="mt-4 leading-relaxed text-gray-300">
            Your report preview is still available. You can return anytime to
            unlock the Pro Audit.
          </p>
          <Link
            href={reportHref}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-3 font-bold text-white transition-colors hover:border-teal-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to report
          </Link>
        </div>
      </div>
    </main>
  );
}
