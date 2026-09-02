import { isAdminUser } from "@/lib/auth/admin";
import {
  createReportServiceClient,
  getRequestUser,
  reportError,
} from "@/lib/reports/server";

function screenshotObjectPath(screenshotUrl: string | null): string {
  if (!screenshotUrl) return "";
  const prefix = "/storage/v1/object/public/screenshots/";
  try {
    const pathname = new URL(screenshotUrl).pathname;
    if (pathname.includes(prefix)) {
      return decodeURIComponent(pathname.split(prefix)[1] || "");
    }
    return decodeURIComponent(pathname.split("/").pop() || "");
  } catch {
    return "";
  }
}

function isMissingTable(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || /does not exist/i.test(error?.message || "");
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(request);
  if (!user) return reportError(401, "AUTH_REQUIRED", "Sign in is required.");
  if (!isAdminUser(user)) return reportError(403, "ADMIN_REQUIRED", "Forbidden.");

  const { id } = await context.params;
  try {
    const supabase = createReportServiceClient();
    const { data: report, error: reportErrorValue } = await supabase
      .from("reports")
      .select("screenshot_url")
      .eq("id", id)
      .maybeSingle();
    if (reportErrorValue) throw reportErrorValue;
    if (!report) return reportError(404, "REPORT_NOT_FOUND", "Report not found.");

    const relatedOperations = [
      supabase.from("email_unlocks").delete().eq("report_id", id),
      supabase.from("payment_events").update({ report_id: null }).eq("report_id", id),
      supabase.from("pro_audit_credits").update({ redeemed_report_id: null }).eq("redeemed_report_id", id),
      supabase.from("analysis_attempts").update({ report_id: null }).eq("report_id", id),
    ];
    const relatedResults = await Promise.all(relatedOperations);
    const relatedError = relatedResults.find(
      (result) => result.error && !isMissingTable(result.error),
    )?.error;
    if (relatedError) throw relatedError;

    const { error: deleteError } = await supabase.from("reports").delete().eq("id", id);
    if (deleteError) throw deleteError;

    const objectPath = screenshotObjectPath(report.screenshot_url);
    if (objectPath) {
      const { error: storageError } = await supabase.storage
        .from("screenshots")
        .remove([objectPath]);
      if (storageError) console.warn("Report deleted but screenshot cleanup failed.");
    }

    return Response.json({ success: true, reportId: id });
  } catch (error) {
    console.error("Admin report deletion failed:", error);
    return reportError(500, "DELETE_FAILED", "Failed to delete report.", true);
  }
}
