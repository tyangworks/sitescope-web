export function getSupabaseServerConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE ||
      "",
  };
}

export const supabaseServiceRoleEnvMessage =
  "Please set SUPABASE_SERVICE_ROLE_KEY in the Next.js server environment.";
