import { NextRequest, NextResponse } from "next/server";

import {
  ANONYMOUS_REPORT_COOKIE,
  ANONYMOUS_REPORT_COOKIE_MAX_AGE,
  createAnonymousReportToken,
  hashAnonymousReportToken,
} from "@/lib/reports/anonymousToken";
import {
  createReportServiceClient,
  getRequestUser,
  reportError,
} from "@/lib/reports/server";

export const runtime = "nodejs";

type AnalyzeUpstreamResponse = {
  success?: boolean;
  cached?: boolean;
  id?: string;
  screenshot?: string;
  error?: string;
};

const reportCloneFields =
  "url, score, summary, screenshot_url, seo_issues, content_suggestions, fix_plans";

async function readJsonResponse(response: Response): Promise<AnalyzeUpstreamResponse> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Analysis service returned HTTP ${response.status}.`);
  }
  return response.json() as Promise<AnalyzeUpstreamResponse>;
}

export async function POST(request: NextRequest) {
  let body: { url?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return reportError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  if (typeof body.url !== "string" || !body.url.trim()) {
    return reportError(400, "URL_REQUIRED", "A website URL is required.");
  }

  const analysisApiUrl = (
    process.env.ANALYSIS_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.sitescope.fyi"
  ).replace(/\/+$/, "");

  try {
    const forwardedFor = request.headers.get("x-forwarded-for")
      ?.split(",")[0]
      .trim();
    const upstreamHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (forwardedFor) upstreamHeaders["x-forwarded-for"] = forwardedFor;

    const upstream = await fetch(`${analysisApiUrl}/api/analyze`, {
      method: "POST",
      headers: upstreamHeaders,
      body: JSON.stringify({
        url: body.url,
        ...(typeof body.language === "string" ? { language: body.language } : {}),
      }),
      cache: "no-store",
    });
    const result = await readJsonResponse(upstream);

    if (!upstream.ok || !result.success || !result.id) {
      return reportError(
        upstream.status || 502,
        "ANALYSIS_FAILED",
        result.error || "Website analysis failed.",
        upstream.status >= 500,
      );
    }

    const user = await getRequestUser(request);
    const anonymousToken = user ? null : createAnonymousReportToken();
    const ownership = {
      user_id: user?.id || null,
      anonymous_token_hash: anonymousToken
        ? hashAnonymousReportToken(anonymousToken)
        : null,
    };
    const supabase = createReportServiceClient();
    let ownedReportId = result.id;

    if (result.cached) {
      const { data: cachedReport, error: cachedError } = await supabase
        .from("reports")
        .select(reportCloneFields)
        .eq("id", result.id)
        .single();
      if (cachedError || !cachedReport) throw cachedError || new Error("Cached report missing.");

      const { data: clonedReport, error: cloneError } = await supabase
        .from("reports")
        .insert({
          ...cachedReport,
          ...ownership,
          is_paid: false,
        })
        .select("id")
        .single();
      if (cloneError || !clonedReport) throw cloneError || new Error("Could not create owned report.");
      ownedReportId = clonedReport.id;
    } else {
      const { data: updatedReport, error: ownershipError } = await supabase
        .from("reports")
        .update(ownership)
        .eq("id", result.id)
        .is("user_id", null)
        .is("anonymous_token_hash", null)
        .select("id")
        .maybeSingle();
      if (ownershipError || !updatedReport) {
        throw ownershipError || new Error("Could not establish report ownership.");
      }
    }

    const response = NextResponse.json({
      success: true,
      cached: Boolean(result.cached),
      id: ownedReportId,
      screenshot: result.screenshot || null,
    });
    if (anonymousToken) {
      response.cookies.set(ANONYMOUS_REPORT_COOKIE, anonymousToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ANONYMOUS_REPORT_COOKIE_MAX_AGE,
        priority: "high",
      });
    }
    return response;
  } catch (error) {
    console.error("Report ownership setup failed after analysis:", error);
    return reportError(
      502,
      "ANALYSIS_PERSISTENCE_FAILED",
      "The audit completed, but its secure report could not be prepared. Please retry.",
      true,
    );
  }
}
