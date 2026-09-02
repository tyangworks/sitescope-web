export function sanitizeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/reports";
  }

  try {
    const parsed = new URL(value, "https://sitescope.local");
    if (parsed.origin !== "https://sitescope.local") return "/reports";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/reports";
  }
}
