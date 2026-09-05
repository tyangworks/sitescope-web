export type GrowthEvent = "homepage_viewed" | "audit_started" | "audit_completed" | "report_viewed" | "signup_started" | "signup_completed" | "pro_upgrade_clicked" | "checkout_started" | "checkout_completed" | "service_clicked" | "service_lead_submitted" | "sample_report_viewed" | "geo_landing_viewed" | "content_audit_cta_clicked";

// No URLs, report IDs, emails, query strings, or report contents are accepted.
export function trackGrowth(event: GrowthEvent) {
  if (typeof window === "undefined") return;
  const target = window as Window & { posthog?: { capture: (event: string) => void }; dataLayer?: Array<{ event: string }> };
  try {
    if (target.posthog) target.posthog.capture(event);
    else if (target.dataLayer) target.dataLayer.push({ event });
  } catch { /* Analytics must never interrupt the product flow. */ }
}
