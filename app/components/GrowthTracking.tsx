"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGrowth, type GrowthEvent } from "@/lib/analytics";

export function ConfirmedCheckoutEvent() {
  useEffect(() => {
    const key = "sitescope_checkout_pending";
    try { if (sessionStorage.getItem(key)) { trackGrowth("checkout_completed"); sessionStorage.removeItem(key); } } catch { /* Storage may be disabled. */ }
  }, []);
  return null;
}
export default function GrowthTracking() {
  const path = usePathname();
  const last = useRef("");
  useEffect(() => {
    if (document.cookie.split("; ").includes("sitescope_signup_completed=1")) {
      trackGrowth("signup_completed");
      document.cookie = "sitescope_signup_completed=; Max-Age=0; Path=/; SameSite=Lax";
    }
    if (last.current === path) return;
    last.current = path;
    const event: GrowthEvent | undefined = path === "/" ? "homepage_viewed" : path === "/sample-report" ? "sample_report_viewed" : ["/geo-audit", "/ai-visibility-audit"].includes(path) ? "geo_landing_viewed" : undefined;
    if (event) trackGrowth(event);
  }, [path]);
  useEffect(() => {
    const clicked = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href");
      if (href === "/services" || href === "/contact") trackGrowth("service_clicked");
      if (href === "/pro-audit") trackGrowth("pro_upgrade_clicked");
      if (path.startsWith("/content/") && (href === "/#audit" || href === "/free-website-audit")) trackGrowth("content_audit_cta_clicked");
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, [path]);
  return null;
}
