import { createReportServiceClient, reportError } from "@/lib/reports/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createReportServiceClient();
    const { data, error } = await supabase
      .from("reports")
      .select("id, url, score, screenshot_url")
      .is("user_id", null)
      .is("anonymous_token_hash", null)
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) return reportError(500, "PUBLIC_REPORTS_FAILED", "Failed to load recent reports.", true);
    return Response.json({ reports: data || [] }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch (error) {
    console.error("Public report metadata failed:", error);
    return reportError(500, "PUBLIC_REPORTS_FAILED", "Failed to load recent reports.", true);
  }
}
