export type ReportAccessLevel = "anonymous" | "free" | "pro" | "denied";

export type ReportIssue = {
  issue: string;
  impact: string;
  fix: string;
};

export type ProReportIssue = ReportIssue & {
  category: "SEO" | "GEO" | "Content" | "Performance" | "Conversion" | "Technical";
  priority: "high" | "medium" | "low";
  evidence: string;
  why_it_matters: string;
  recommendation: string;
};

export type ReportSuggestion = {
  area: string;
  suggestion: string;
};

export type FixPlan = {
  step: number;
  action: string;
  code_snippet?: string;
  priority: "high" | "medium" | "low";
  category: ProReportIssue["category"];
  rationale: string;
  implementation_steps: string[];
  expected_outcome: string;
};

export type RawReportDatabaseRow = {
  id: string;
  url: string;
  created_at: string;
  updated_at?: string | null;
  score: number | null;
  summary: string | null;
  screenshot_url: string | null;
  is_paid: boolean;
  seo_issues: unknown;
  content_suggestions: unknown;
  fix_plans: unknown;
  user_id: string | null;
  anonymous_token_hash: string | null;
};

type PublicReportBase = {
  id: string;
  url: string;
  created_at: string;
  score: number;
  summary: string;
  screenshot_url: string;
};

export type AnonymousReportResponse = PublicReportBase & {
  access_level: "anonymous";
  seo_issues: ReportIssue[];
  content_suggestions: ReportSuggestion[];
};

export type FreeReportResponse = PublicReportBase & {
  access_level: "free";
  seo_issues: ReportIssue[];
  content_suggestions: ReportSuggestion[];
};

export type ProReportResponse = PublicReportBase & {
  access_level: "pro";
  seo_issues: ProReportIssue[];
  content_suggestions: ReportSuggestion[];
  fix_plans: FixPlan[];
};

export type AuthorizedReportResponse =
  | AnonymousReportResponse
  | FreeReportResponse
  | ProReportResponse;

export type ReportHistoryItem = PublicReportBase & {
  access_level: "free" | "pro";
};
