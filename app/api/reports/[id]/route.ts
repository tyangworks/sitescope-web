import { NextRequest } from "next/server";

import { getReportAccessLevel } from "@/lib/reports/access";
import { isAdminUser } from "@/lib/auth/admin";
import { projectAuthorizedReport } from "@/lib/reports/projections";
import {
  createReportServiceClient,
  getAnonymousTokenHash,
  getRequestUser,
  reportError,
} from "@/lib/reports/server";
import type { RawReportDatabaseRow } from "@/lib/reports/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const supabase = createReportServiceClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return reportError(500, "REPORT_READ_FAILED", "Failed to load report.", true);
    if (!data) return reportError(404, "REPORT_NOT_FOUND", "Report not found.");

    const user = await getRequestUser(request);
    const accessLevel = isAdminUser(user)
      ? "pro"
      : getReportAccessLevel(data as RawReportDatabaseRow, {
          userId: user?.id || null,
          anonymousTokenHash: getAnonymousTokenHash(request),
        });

    if (accessLevel === "denied") {
      return reportError(404, "REPORT_NOT_FOUND", "Report not found.");
    }

    return Response.json(projectAuthorizedReport(data as RawReportDatabaseRow, accessLevel), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Authorized report read failed:", error);
    return reportError(500, "REPORT_READ_FAILED", "Failed to load report.", true);
  }
}
