"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
type Report = { id: string; url: string; score: number; screenshot_url: string };
export default function PublicReports() {
  const { language, t } = useTranslation();
  const zh = language === "zh";
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<{ reports: Report[]; nextPage: number | null }>({ reports: [], nextPage: null });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/reports/public?page=${page}`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then((data) => { setResult(data); setFailed(false); })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page]);
  const move = (next: number) => { setLoading(true); setFailed(false); setPage(next); };
  if (!loading && !failed && !result.reports.length && page === 0) return null;
  return <section className="border-y border-gray-800 bg-[#111827]/50 py-12" aria-label={zh ? "公开审计报告" : "Public audit reports"}>
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold">{t.home.recentAudits}</h2><p className="mt-2 text-sm text-gray-400">{zh ? "公开查看免费预览。每位购买者独立解锁 Pro，不共享他人的付费权益。" : "Browse free previews. Pro access is purchased separately for each reader."}</p></div>
        <div className="flex items-center gap-3">
          <button type="button" disabled={loading || page === 0} onClick={() => move(page - 1)} title={zh ? "上一组报告" : "Previous reports"} aria-label={zh ? "上一组报告" : "Previous reports"} className="flex h-10 w-10 items-center justify-center rounded border border-gray-600 disabled:opacity-30"><ArrowLeft size={18} /></button>
          <span className="text-sm tabular-nums" aria-live="polite">{page + 1}</span>
          <button type="button" disabled={loading || result.nextPage === null} onClick={() => move(result.nextPage!)} title={zh ? "下一组报告" : "Next reports"} aria-label={zh ? "下一组报告" : "Next reports"} className="flex h-10 w-10 items-center justify-center rounded border border-gray-600 disabled:opacity-30"><ArrowRight size={18} /></button>
        </div>
      </div>
      {failed && <p role="alert" className="mb-4 text-amber-300">{zh ? "报告暂时无法加载，请稍后刷新。" : "Reports could not be loaded. Please refresh shortly."}</p>}
      <div className="grid gap-6 md:grid-cols-3" aria-busy={loading}>
        {result.reports.map((report) => <Link key={report.id} href={`/report/${report.id}`} className="min-w-0 rounded-lg border border-gray-700 bg-[#111827] p-3 hover:border-teal-400">
          <div className="relative mb-3 aspect-video overflow-hidden rounded bg-gray-900">{report.screenshot_url && <Image src={report.screenshot_url} alt={zh ? "网站审计截图" : "Website audit screenshot"} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />}</div>
          <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate" title={report.url}>{report.url}</span><span className="shrink-0 text-teal-300">{t.reports.score}: {report.score}</span></div>
        </Link>)}
        {loading && !result.reports.length && [0, 1, 2].map((key) => <div key={key} className="aspect-video animate-pulse rounded-lg bg-gray-800" />)}
      </div>
    </div>
  </section>;
}
