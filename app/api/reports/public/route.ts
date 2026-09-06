import { createReportServiceClient, reportError } from "@/lib/reports/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const rawPage = new URL(request.url).searchParams.get("page") || "0";
    if (!/^\d{1,5}$/.test(rawPage)) return reportError(400, "INVALID_PAGE", "Invalid page number.");
    const page = Number(rawPage);
    const supabase = createReportServiceClient();
    const query = supabase
      .from("reports")
      .select("id, url, score, screenshot_url, created_at")
      .or("is_public.eq.true,and(user_id.is.null,anonymous_token_hash.is.null)")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(page * 3, page * 3 + 3);
    const { data, error } = await query;
    if (error) return reportError(500, "PUBLIC_REPORTS_FAILED", "Failed to load recent reports.", true);
    const reports = (data || []).slice(0, 3).map(({ id, url, score, screenshot_url }) => {
      let publicUrl = "";
      try { const parsed = new URL(url); publicUrl = parsed.origin + parsed.pathname; } catch { /* malformed legacy URL */ }
      return { id, url: publicUrl, score, screenshot_url };
    });
    return Response.json({ reports, nextPage: data && data.length > 3 ? page + 1 : null }, { headers: { "Cache-Control": "public, max-age=30" } });
  } catch (error) {
    console.error("Public report metadata failed:", error);
    return reportError(500, "PUBLIC_REPORTS_FAILED", "Failed to load recent reports.", true);
  }
}
