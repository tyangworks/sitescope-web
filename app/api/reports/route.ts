import { NextRequest } from "next/server";

import {
  createReportServiceClient,
  getRequestUser,
  reportError,
} from "@/lib/reports/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return reportError(401, "AUTH_REQUIRED", "Sign in to view saved reports.");

  try {
    const supabase = createReportServiceClient();
    const { data, error } = await supabase
      .from("reports")
      .select("id, url, score, summary, screenshot_url, created_at, is_paid")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return reportError(500, "REPORT_HISTORY_FAILED", "Failed to load reports.", true);

    return Response.json({
      reports: (data || []).map((report) => ({
        id: report.id,
        url: report.url,
        score: typeof report.score === "number" ? report.score : 0,
        summary: report.summary || "",
        screenshot_url: report.screenshot_url || "",
        created_at: report.created_at,
        access_level: report.is_paid ? "pro" : "free",
      })),
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Report history failed:", error);
    return reportError(500, "REPORT_HISTORY_FAILED", "Failed to load reports.", true);
  }
}
