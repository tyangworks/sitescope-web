import type {
  AnonymousReportResponse,
  AuthorizedReportResponse,
  FixPlan,
  FreeReportResponse,
  ProReportResponse,
  RawReportDatabaseRow,
  ReportHistoryItem,
  ReportIssue,
  ReportSuggestion,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function projectIssues(value: unknown): ReportIssue[] {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter(Boolean).map((item) => ({
    issue: text(item?.issue),
    impact: text(item?.impact),
    fix: text(item?.fix),
  }));
}

function projectSuggestions(value: unknown): ReportSuggestion[] {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter(Boolean).map((item) => ({
    area: text(item?.area),
    suggestion: text(item?.suggestion),
  }));
}

function projectFixPlans(value: unknown): FixPlan[] {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter(Boolean).map((item, index) => {
    const priority = item?.priority;
    return {
      step: typeof item?.step === "number" ? item.step : index + 1,
      action: text(item?.action),
      ...(text(item?.code_snippet)
        ? { code_snippet: text(item?.code_snippet) }
        : {}),
      priority:
        priority === "high" || priority === "medium" || priority === "low"
          ? priority
          : "medium",
    };
  });
}

function projectBase(report: RawReportDatabaseRow) {
  return {
    id: report.id,
    url: report.url,
    created_at: report.created_at,
    score: typeof report.score === "number" ? report.score : 0,
    summary: report.summary || "",
    screenshot_url: report.screenshot_url || "",
  };
}

export function projectAnonymousReport(
  report: RawReportDatabaseRow,
): AnonymousReportResponse {
  return {
    ...projectBase(report),
    access_level: "anonymous",
    seo_issues: projectIssues(report.seo_issues).slice(0, 3),
    content_suggestions: projectSuggestions(report.content_suggestions).slice(0, 2),
  };
}

export function projectFreeReport(
  report: RawReportDatabaseRow,
): FreeReportResponse {
  return {
    ...projectBase(report),
    access_level: "free",
    seo_issues: projectIssues(report.seo_issues),
    content_suggestions: projectSuggestions(report.content_suggestions),
  };
}

export function projectProReport(
  report: RawReportDatabaseRow,
): ProReportResponse {
  return {
    ...projectBase(report),
    access_level: "pro",
    seo_issues: projectIssues(report.seo_issues),
    content_suggestions: projectSuggestions(report.content_suggestions),
    fix_plans: projectFixPlans(report.fix_plans),
  };
}

export function projectAuthorizedReport(
  report: RawReportDatabaseRow,
  accessLevel: Exclude<AuthorizedReportResponse["access_level"], "denied">,
): AuthorizedReportResponse {
  if (accessLevel === "pro") return projectProReport(report);
  if (accessLevel === "free") return projectFreeReport(report);
  return projectAnonymousReport(report);
}

export function projectReportHistoryItem(
  report: RawReportDatabaseRow,
): ReportHistoryItem {
  return {
    ...projectBase(report),
    access_level: report.is_paid ? "pro" : "free",
  };
}
