import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "./config";

const { url, key } = getSupabasePublicConfig();

export const supabase = createBrowserClient(url, key);
