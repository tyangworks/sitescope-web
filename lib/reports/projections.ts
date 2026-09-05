import type {
  AnonymousReportResponse,
  AuthorizedReportResponse,
  FixPlan,
  FreeReportResponse,
  ProReportResponse,
  ProReportIssue,
  RawReportDatabaseRow,
  ReportHistoryItem,
  ReportIssue,
  ReportSuggestion,
  SearchVisibility,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function issuePriority(value: unknown): number {
  const item = asRecord(value);
  const priority = text(item?.priority).toLowerCase() || text(item?.impact).toLowerCase();
  return priority === "high" ? 0 : priority === "low" ? 2 : 1;
}

function projectIssues(value: unknown): ReportIssue[] {
  if (!Array.isArray(value)) return [];
  return [...value].sort((a, b) => issuePriority(a) - issuePriority(b)).map(asRecord).filter(Boolean).map((item) => ({
    issue: text(item?.issue),
    impact: text(item?.impact),
    fix: text(item?.fix),
    ...(categories.has(text(item?.category)) ? { category: text(item?.category) as ReportIssue["category"] } : {}),
  }));
}

const categories = new Set(["SEO", "GEO", "Content", "Performance", "Conversion", "Technical"]);

function projectProIssues(value: unknown): ProReportIssue[] {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter(Boolean).map((item) => {
    const impact = text(item?.impact);
    const priority = item?.priority;
    const rawCategory = text(item?.category);
    return {
      issue: text(item?.issue),
      impact,
      fix: text(item?.fix),
      category: (categories.has(rawCategory) ? rawCategory : "SEO") as ProReportIssue["category"],
      priority:
        priority === "high" || priority === "medium" || priority === "low"
          ? priority
          : impact === "High"
            ? "high"
            : impact === "Low"
              ? "low"
              : "medium",
      evidence: text(item?.evidence),
      why_it_matters: text(item?.why_it_matters),
      recommendation: text(item?.recommendation) || text(item?.fix),
    };
  });
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
      category: (categories.has(text(item?.category)) ? text(item?.category) : "SEO") as FixPlan["category"],
      rationale: text(item?.rationale),
      implementation_steps: Array.isArray(item?.implementation_steps)
        ? item.implementation_steps.map(text).filter(Boolean).slice(0, 8)
        : [],
      expected_outcome: text(item?.expected_outcome),
    };
  });
}

function projectBase(report: RawReportDatabaseRow) {
  return {
    ...(projectSearchVisibility(report.search_visibility) ? { search_visibility: projectSearchVisibility(report.search_visibility)! } : {}),
    id: report.id,
    url: report.url,
    created_at: report.created_at,
    score: typeof report.score === "number" ? report.score : 0,
    summary: report.summary || "",
    screenshot_url: report.screenshot_url || "",
  };
}

export function projectSearchVisibility(value: unknown): SearchVisibility | undefined {
  const raw = asRecord(value);
  const sub = asRecord(raw?.categories);
  const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100;
  const keys = ["entityClarity", "contentStructure", "evidenceTrust", "structuredData", "answerability", "topicalAuthority"] as const;
  if (raw?.version !== 1 || raw.scope !== "single_page" || !valid(raw.seo_score) || !valid(raw.geo_score) || !sub || !keys.every((key) => valid(sub[key]))) return undefined;
  return { version: 1, scope: "single_page", seo_score: raw.seo_score, geo_score: raw.geo_score,
    categories: Object.fromEntries(keys.map((key) => [key, sub[key]])) as SearchVisibility["categories"],
    index_restricted: raw.index_restricted === true };
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
    seo_issues: projectProIssues(report.seo_issues),
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
