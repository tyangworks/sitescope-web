import type { User } from "@supabase/supabase-js";

export function isConfiguredAdminEmail(
  email: string | null | undefined,
  configuredEmail: string | null | undefined,
): boolean {
  if (!email || !configuredEmail) return false;
  return email.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
}

export function isAdminUser(user: User | null): boolean {
  return isConfiguredAdminEmail(user?.email, process.env.ADMIN_EMAIL);
}
