import { supabase } from "@/lib/auth";
import { trackGrowth } from "@/lib/analytics";

export async function getAuthenticatedRequestHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const authHeaders = await getAuthenticatedRequestHeaders();
  const endpoint = typeof input === "string" ? input : "";
  if (endpoint === "/api/analyze" && init.method === "POST") trackGrowth("audit_started");
  const response = await fetch(input, {
    ...init,
    headers: {
      ...authHeaders,
      ...init.headers,
    },
  });
  if (response.ok) {
    if (endpoint === "/api/analyze" && init.method === "POST") trackGrowth("audit_completed");
    if (/^\/api\/reports\/[^/]+$/.test(endpoint) && !init.method) trackGrowth("report_viewed");
    if (endpoint === "/api/create-checkout-session") {
      try {
        const data = await response.clone().json();
        if (typeof data.url === "string" && data.url.startsWith("https://checkout.stripe.com/")) {
          trackGrowth("checkout_started");
          sessionStorage.setItem("sitescope_checkout_pending", "1");
        }
      } catch { /* Optional tracking only. */ }
    }
  }
  return response;
}
