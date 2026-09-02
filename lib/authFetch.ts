import { supabase } from "@/lib/auth";

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
  return fetch(input, {
    ...init,
    headers: {
      ...authHeaders,
      ...init.headers,
    },
  });
}
