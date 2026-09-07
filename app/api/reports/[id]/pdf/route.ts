import { NextRequest } from "next/server";

import { getAuthorizedProReport } from "@/lib/reports/authorized";

export const dynamic = "force-dynamic";

function safeDomain(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "").replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "website";
  } catch {
    return "website";
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authorized = await getAuthorizedProReport(request, id);
  if (!authorized.ok) {
    return Response.json(
      { error: authorized.message, code: authorized.code, retryable: authorized.retryable || false },
      { status: authorized.status },
    );
  }

  const rendererUrl = process.env.ANALYSIS_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";
  const renderSecret = process.env.PDF_RENDER_SECRET;
  if (!renderSecret) {
    return Response.json({ error: "PDF rendering is not configured.", code: "PDF_RENDER_FAILED", retryable: true }, { status: 503 });
  }

  const language = request.nextUrl.searchParams.get("language") === "zh" ? "zh" : "en";
  try {
    const response = await fetch(`${rendererUrl.replace(/\/$/, "")}/internal/render-report-pdf`, {
      method: "POST",
      headers: { Authorization: `Bearer ${renderSecret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ report: authorized.projection, language }),
      cache: "no-store",
    });

    if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) {
      return Response.json({ error: "PDF rendering failed.", code: "PDF_RENDER_FAILED", retryable: response.status >= 500 }, { status: 502 });
    }

    const filename = `sitescope-growth-audit-${safeDomain(authorized.report.url)}-${new Date().toISOString().slice(0, 10)}.pdf`;
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("PDF render request failed:", error);
    return Response.json({ error: "PDF rendering failed.", code: "PDF_RENDER_FAILED", retryable: true }, { status: 502 });
  }
}
