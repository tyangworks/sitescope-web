import type { NextRequest } from "next/server";

import { isAdminUser } from "@/lib/auth/admin";
import { getReportAccessLevel } from "@/lib/reports/access";
import { projectProReport } from "@/lib/reports/projections";
import {
  createReportServiceClient,
  getAnonymousTokenHash,
  getRequestUser,
} from "@/lib/reports/server";
import type { ProReportResponse, RawReportDatabaseRow } from "@/lib/reports/types";

export type AuthorizedProReportResult =
  | { ok: true; report: RawReportDatabaseRow; projection: ProReportResponse }
  | { ok: false; status: number; code: string; message: string; retryable?: boolean };

export async function getAuthorizedProReport(
  request: NextRequest,
  reportId: string,
): Promise<AuthorizedProReportResult> {
  if (!/^[0-9a-f-]{36}$/i.test(reportId)) {
    return { ok: false, status: 404, code: "REPORT_NOT_FOUND", message: "Report not found." };
  }

  try {
    const supabase = createReportServiceClient();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .maybeSingle();

    if (error) {
      return { ok: false, status: 500, code: "REPORT_READ_FAILED", message: "Failed to load report.", retryable: true };
    }
    if (!data) {
      return { ok: false, status: 404, code: "REPORT_NOT_FOUND", message: "Report not found." };
    }

    const report = data as RawReportDatabaseRow;
    const user = await getRequestUser(request);
    const accessLevel = isAdminUser(user)
      ? "pro"
      : getReportAccessLevel(report, {
          userId: user?.id || null,
          anonymousTokenHash: getAnonymousTokenHash(request),
        });

    if (accessLevel === "denied") {
      return { ok: false, status: 404, code: "REPORT_NOT_FOUND", message: "Report not found." };
    }
    if (accessLevel !== "pro") {
      return { ok: false, status: 403, code: "PRO_REPORT_REQUIRED", message: "A Pro report is required to download the full PDF." };
    }

    const projection = projectProReport(report);
    if (!projection.fix_plans.length) {
      return { ok: false, status: 422, code: "PRO_REPORT_REQUIRED", message: "This Pro report does not contain the required fix plan." };
    }

    return { ok: true, report, projection };
  } catch (error) {
    console.error("Authorized Pro report load failed:", error);
    return { ok: false, status: 500, code: "REPORT_READ_FAILED", message: "Failed to load report.", retryable: true };
  }
}
